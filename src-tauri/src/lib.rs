use serde::{Deserialize, Serialize};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize)]
struct TodoList {
    todo: Vec<Todo>,
}

#[derive(Serialize)]
struct Todo {
    title: String,
    create_time: String,
    comp_date: String,
    comp_flg: bool,
}

#[tauri::command]
fn todo_list_select() -> TodoList {
    let mut todoList = Vec::new();
    todoList.push(Todo {
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
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
