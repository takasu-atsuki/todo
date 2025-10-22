use chrono::{DateTime, Local, Utc};
use postgres::{Client, NoTls};
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

#[derive(Deserialize, Serialize)]
struct User {
    id: Uuid,
    name: String,
    create_date: DateTime<Local>,
}

#[derive(Serialize)]
struct TodoList {
    todo: Vec<Todo>,
}

#[derive(Serialize)]
struct Todo {
    id: String,
    title: String,
    create_time: String,
    comp_date: String,
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
    // println!("{}", name);
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
fn todo_list_select() -> TodoList {
    let mut todoList = Vec::new();
    todoList.push(Todo {
        id: "100".to_string(),
        title: "テスト".to_string(),
        create_time: "2025/10/10".to_string(),
        comp_date: "2025/10/10".to_string(),
        comp_flg: true,
    });
    TodoList { todo: todoList }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            todo_list_select,
            create_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
