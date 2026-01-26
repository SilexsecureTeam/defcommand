use tauri::{Listener, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            let splashscreen = app.get_webview_window("splashscreen").unwrap();
            let main_window = app.get_webview_window("main").unwrap();

            use tauri::{LogicalSize, Size};
            main_window.set_min_size(Some(Size::Logical(LogicalSize {
                width: 800.0,
                height: 600.0,
            })))?;

            // Center and show splashscreen after small delay
            splashscreen.center()?;
            main_window.center()?;
            let splashscreen_clone = splashscreen.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(200));
                splashscreen_clone.show().unwrap();
            });

            // When frontend is ready, show main window after 3 seconds
            let app_handle = app.handle();
            let splash_for_listener = splashscreen.clone();
            let main_for_listener = main_window.clone();

            app_handle.listen("frontend-ready", move |_event| {
                // Clone again so the thread owns its own copies
                let splash_to_close = splash_for_listener.clone();
                let main_to_show = main_for_listener.clone();

                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_secs(3));
                    main_to_show.show().unwrap();
                    splash_to_close.close().unwrap();
                });
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
