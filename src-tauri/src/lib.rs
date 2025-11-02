use chrono::{DateTime, Local, Utc};
use postgres::{Client, NoTls, Row};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::env;
use std::sync::{Arc, LazyLock, Mutex};
use std::time::SystemTime;
use uuid::Uuid;

pub static PSQL_CLIENT: LazyLock<Arc<Mutex<RefCell<Client>>>> = LazyLock::new(|| {
    Arc::new(Mutex::new(RefCell::new(
        Client::connect(
            "host=localhost user=postgres dbname=todo password=postgres",
            NoTls,
        )
        .unwrap(),
    )))
});

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Deserialize, Serialize, Debug)]
struct User {
    id: Uuid,
    name: String,
    create_date: DateTime<Local>,
}

#[derive(Serialize, Debug, Deserialize)]
struct TodoList {
    todo: Vec<Todo>,
}

#[derive(Serialize, Debug, Deserialize)]
struct Todo {
    id: Uuid,
    title: String,
    create_time: DateTime<Local>,
    comp_date: DateTime<Local>,
    comp_flg: bool,
}

#[cfg(target_os = "windows")]
fn get_user() {
    env::var("USERNAME")
}

#[cfg(target_os = "linux")]
fn get_user() {
    env::var("USER")
}

#[cfg(target_os = "macos")]
fn get_user() -> Result<String, std::env::VarError> {
    env::var("USER")
}

#[tauri::command]
fn create_user() -> Result<User, String> {
    let name = get_user().unwrap();
    let db_connection = PSQL_CLIENT.lock().unwrap();
    let mut dereference_db: std::cell::RefMut<'_, Client> = db_connection.borrow_mut();
    if let true = dereference_db
        .query_opt("SELECT * FROM users where name = $1", &[&name])
        .unwrap()
        .is_none()
    {
        dereference_db.execute("insert into users (name) values ($1)", &[&name]);
    }

    let user = dereference_db
        .query_one("SELECT * FROM users where name = $1", &[&name])
        .unwrap();

    Ok(User {
        id: user.get("id"),
        name: user.get("name"),
        create_date: user.get::<&str, SystemTime>("create_date").into(),
    })
}

#[tauri::command]
fn todo_list_select() -> Vec<Todo> {
    let db_connection = PSQL_CLIENT.lock().unwrap();
    let mut dereference_db = db_connection.borrow_mut();
    let todo_list = dereference_db
        .query("SELECT * FROM todos where comp_flg = false", &[])
        .unwrap();
    let mut todoList = Vec::new();
    if todo_list.len() > 0 {
        for todo in todo_list {
            todoList.push(Todo {
                id: todo.get("id"),
                title: todo.get("title"),
                create_time: todo.get("start_datetime"),
                comp_date: todo.get("complete_datetime"),
                comp_flg: todo.get("comp_flg"),
            });
        }
    }

    todoList
}

#[tauri::command]
fn add_todo(title: &str, create_time: DateTime<Local>, comp_date: DateTime<Local>) -> Todo {
    let db_connection = PSQL_CLIENT.lock().unwrap();
    let mut dereference_db = db_connection.borrow_mut();
    let result = dereference_db
        .query_one(
            "INSERT INTO todos (title, start_datetime, complete_datetime) values ($1, $2, $3) RETURNING id, title, start_datetime, complete_datetime, comp_flg",
            &[&title, &create_time, &comp_date],
        )
        .unwrap();
    println!("{:?}", result);
    let todo = Todo {
        id: result.get("id"),
        title: result.get("title"),
        create_time: result.get("start_datetime"),
        comp_date: result.get("complete_datetime"),
        comp_flg: result.get("comp_flg"),
    };
    return todo;
}

#[tauri::command]
fn update_comp_flg(todo: Todo) -> bool {
    let db_connection = PSQL_CLIENT.lock().unwrap();
    let mut dereference_db = db_connection.borrow_mut();
    let result = dereference_db
        .execute(
            "UPDATE todos SET comp_flg = true where id = $1",
            &[&todo.id],
        )
        .unwrap();
    return result != 0;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            todo_list_select,
            create_user,
            add_todo,
            update_comp_flg
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
