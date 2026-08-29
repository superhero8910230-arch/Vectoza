#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use vtracer::{convert_image_to_svg, PresetConverter};
use std::path::PathBuf;

#[tauri::command]
fn convert_to_svg(image_path: String, _color_count: usize) -> Result<String, String> {
    let input_path = PathBuf::from(image_path);
    let output_path = PathBuf::from("temp_output.svg");

    let config = PresetConverter::full_color();
    
    match convert_image_to_svg(&input_path, &output_path, config) {
        Ok(_) => {
            let svg_content = std::fs::read_to_string(output_path).map_err(|e| e.to_string())?;
            Ok(svg_content)
        },
        Err(e) => Err(e.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![convert_to_svg])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
