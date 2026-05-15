package com.digitalvirgo.galaxytv

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.graphics.Color
import android.os.Bundle
import android.view.InputDevice
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN)
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        )

        webView = WebView(this).apply {
            isFocusable = true
            isFocusableInTouchMode = true
            requestFocus()

            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            settings.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            settings.cacheMode = WebSettings.LOAD_DEFAULT
            settings.databaseEnabled = true
            settings.allowFileAccess = true
            settings.allowContentAccess = true
            settings.useWideViewPort = true
            settings.loadWithOverviewMode = true

            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(
                    view: WebView?,
                    request: WebResourceRequest?
                ): Boolean = false

                override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                    view?.evaluateJavascript("window.__TV_PLATFORM__='androidtv';", null)
                }
            }

            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest?) {
                    request?.grant(request.resources)
                }

                override fun getDefaultVideoPoster(): Bitmap {
                    return Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888).apply {
                        eraseColor(Color.BLACK)
                    }
                }
            }
        }

        setContentView(webView)
        webView.loadUrl("https://tv-vod.blast.dvbuilder.com/")
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun dispatchGenericMotionEvent(event: MotionEvent): Boolean {
        val source = event.source
        if (source and InputDevice.SOURCE_JOYSTICK == InputDevice.SOURCE_JOYSTICK ||
            source and InputDevice.SOURCE_GAMEPAD == InputDevice.SOURCE_GAMEPAD) {

            val x = event.getAxisValue(MotionEvent.AXIS_X).let { if (it == 0f) event.getAxisValue(MotionEvent.AXIS_HAT_X) else it }
            val y = event.getAxisValue(MotionEvent.AXIS_Y).let { if (it == 0f) event.getAxisValue(MotionEvent.AXIS_HAT_Y) else it }

            val keyCode = when {
                y < -DEAD_ZONE -> KeyEvent.KEYCODE_DPAD_UP
                y > DEAD_ZONE  -> KeyEvent.KEYCODE_DPAD_DOWN
                x < -DEAD_ZONE -> KeyEvent.KEYCODE_DPAD_LEFT
                x > DEAD_ZONE  -> KeyEvent.KEYCODE_DPAD_RIGHT
                else -> 0
            }

            if (keyCode == 0) {
                lastStickKeyCode = 0
                return true
            }

            val now = System.currentTimeMillis()
            if (keyCode == lastStickKeyCode && now - stickRepeatTime < REPEAT_DELAY_MS) {
                return true
            }

            lastStickKeyCode = keyCode
            stickRepeatTime = now

            webView.dispatchKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, keyCode))
            webView.dispatchKeyEvent(KeyEvent(KeyEvent.ACTION_UP, keyCode))

            return true
        }

        return super.dispatchGenericMotionEvent(event)
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    companion object {
        private const val DEAD_ZONE = 0.5f
        private const val REPEAT_DELAY_MS = 250L
    }

    private var lastStickKeyCode = 0
    private var stickRepeatTime = 0L
    
}
