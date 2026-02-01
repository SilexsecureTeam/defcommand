use tauri::{image::Image, tray::TrayIconBuilder, Listener, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            // FIX 1: Explicitly set the ID to "main-tray"
            let _tray = TrayIconBuilder::with_id("main-tray")
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;

            let handle_for_theme = app.handle().clone();

            // Listen for theme changes
            app.listen("tauri://theme-changed", move |event| {
                let tray_instance = handle_for_theme.tray_by_id("main-tray");

                // The payload is a JSON string (e.g. "\"dark\"" or "\"light\"")
                // We strip the extra quotes if they exist or use serde to clean it up
                if let Ok(theme_raw) = serde_json::from_str::<String>(event.payload()) {
                    let theme = theme_raw.to_lowercase();
                    println!("System theme changed to: {}", theme);

                    let icon_bytes = if theme.contains("dark") {
                        include_bytes!("../icons/128x128/1x/Control Center W.png").as_slice()
                    } else {
                        include_bytes!("../icons/128x128/1x/Control Center G.png").as_slice()
                    };

                    if let (Some(t), Ok(img)) = (tray_instance, Image::from_bytes(icon_bytes)) {
                        let _ = t.set_icon(Some(img));
                    }
                }
            });

            // --- Rest of your window logic ---
            let splashscreen = app.get_webview_window("splashscreen").unwrap();
            let main_window = app.get_webview_window("main").unwrap();

            // Set Min Size
            main_window.set_min_size(Some(tauri::Size::Logical(tauri::LogicalSize {
                width: 800.0,
                height: 600.0,
            })))?;

            splashscreen.center()?;
            main_window.center()?;

            let splash_clone = splashscreen.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(200));
                let _ = splash_clone.show();
            });

            let splash_for_listener = splashscreen.clone();
            let main_for_listener = main_window.clone();

            app.listen("frontend-ready", move |_event| {
                let s = splash_for_listener.clone();
                let m = main_for_listener.clone();
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_secs(3));
                    let _ = m.show();
                    let _ = s.close();
                });
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
