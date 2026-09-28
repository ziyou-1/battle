package com.yunxu.client;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

/** Native shell for the existing same-origin /app/ client. */
public class MainActivity extends Activity {
    private static final String PREFS = "client_settings";
    private static final String SERVER = "server_origin";
    private static final int FILE_PICKER = 100;

    private WebView webView;
    private LinearLayout root;
    private LinearLayout errorPanel;
    private ProgressBar progress;
    private ValueCallback<Uri[]> fileCallback;
    private String serverOrigin;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(37, 99, 235));
        getWindow().setNavigationBarColor(Color.WHITE);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        serverOrigin = getPreferences(MODE_PRIVATE).getString(SERVER, null);
        if (serverOrigin == null) showSettings(false);
        else showClient();
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private TextView text(String label, int size, int color) {
        TextView view = new TextView(this);
        view.setText(label);
        view.setTextSize(size);
        view.setTextColor(color);
        return view;
    }

    private void showSettings(boolean canCancel) {
        if (canCancel && webView != null) {
            EditText input = serverInput();
            new AlertDialog.Builder(this)
                .setTitle("服务器地址")
                .setMessage("填写电脑局域网地址或正式网址。手机和服务器须能互相访问。")
                .setView(input)
                .setNegativeButton("取消", null)
                .setPositiveButton("连接", (dialog, which) -> connect(input.getText().toString()))
                .show();
            return;
        }

        root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_VERTICAL);
        root.setPadding(dp(28), dp(24), dp(28), dp(24));
        root.setBackgroundColor(Color.WHITE);
        TextView title = text("连接云序工作室", 24, Color.rgb(30, 41, 59));
        root.addView(title);
        TextView hint = text("首次使用请填写后台服务器地址。\n本机 127.0.0.1 在手机上无法访问电脑。", 14, Color.rgb(100, 116, 139));
        LinearLayout.LayoutParams hintParams = new LinearLayout.LayoutParams(-1, -2);
        hintParams.topMargin = dp(12);
        hintParams.bottomMargin = dp(20);
        root.addView(hint, hintParams);
        EditText input = serverInput();
        root.addView(input, new LinearLayout.LayoutParams(-1, dp(54)));
        Button connect = new Button(this);
        connect.setText("连接并打开前台");
        connect.setAllCaps(false);
        LinearLayout.LayoutParams buttonParams = new LinearLayout.LayoutParams(-1, dp(52));
        buttonParams.topMargin = dp(16);
        root.addView(connect, buttonParams);
        connect.setOnClickListener(v -> connect(input.getText().toString()));
        setContentView(root);
    }

    private EditText serverInput() {
        EditText input = new EditText(this);
        input.setSingleLine(true);
        input.setTextSize(16);
        input.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI);
        input.setHint("例如 http://192.168.1.10:8100");
        input.setText(serverOrigin == null ? "" : serverOrigin);
        input.selectAll();
        return input;
    }

    private void connect(String raw) {
        String origin = normalizeOrigin(raw);
        if (origin == null) {
            new AlertDialog.Builder(this)
                .setMessage("请输入完整的 http:// 或 https:// 服务器地址，例如 http://192.168.1.10:8100")
                .setPositiveButton("知道了", null).show();
            return;
        }
        serverOrigin = origin;
        getPreferences(MODE_PRIVATE).edit().putString(SERVER, origin).apply();
        if (webView == null) showClient();
        else {
            errorPanel.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            webView.loadUrl(serverOrigin + "/app/");
        }
    }

    /** Accept an origin or a pasted /app/ link; require a real hostname. */
    private String normalizeOrigin(String raw) {
        if (raw == null) return null;
        String value = raw.trim();
        try {
            Uri uri = Uri.parse(value);
            String scheme = uri.getScheme();
            if (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme)) return null;
            if (uri.getHost() == null || uri.getHost().isEmpty() || uri.getUserInfo() != null) return null;
            if (uri.getPort() > 65535 || uri.getPort() < -1) return null;
            String path = uri.getPath();
            if (path != null && !path.isEmpty() && !"/".equals(path) && !"/app".equals(path) && !"/app/".equals(path)) return null;
            if (uri.getQuery() != null) return null;
            String host = uri.getHost();
            if (host.contains(":")) host = "[" + host + "]";
            return scheme.toLowerCase() + "://" + host + (uri.getPort() == -1 ? "" : ":" + uri.getPort());
        } catch (Exception ex) {
            return null;
        }
    }

    private void showClient() {
        root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.WHITE);
        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setGravity(Gravity.CENTER_VERTICAL);
        toolbar.setPadding(dp(12), 0, dp(4), 0);
        toolbar.setBackgroundColor(Color.rgb(248, 250, 252));
        TextView title = text("云序工作室", 15, Color.rgb(30, 41, 59));
        toolbar.addView(title, new LinearLayout.LayoutParams(0, -2, 1));
        Button refresh = new Button(this);
        refresh.setText("刷新");
        refresh.setTextSize(12);
        refresh.setAllCaps(false);
        toolbar.addView(refresh, new LinearLayout.LayoutParams(dp(60), dp(40)));
        Button settings = new Button(this);
        settings.setText("服务器");
        settings.setTextSize(12);
        settings.setAllCaps(false);
        toolbar.addView(settings, new LinearLayout.LayoutParams(dp(72), dp(40)));
        root.addView(toolbar, new LinearLayout.LayoutParams(-1, dp(44)));
        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100);
        root.addView(progress, new LinearLayout.LayoutParams(-1, dp(2)));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.WHITE);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(false);
        webView.getSettings().setAllowContentAccess(true);
        webView.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        CookieManager.getInstance().setAcceptCookie(true);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                Uri origin = Uri.parse(serverOrigin);
                if (origin.getScheme().equalsIgnoreCase(uri.getScheme())
                    && origin.getHost().equalsIgnoreCase(uri.getHost())
                    && origin.getPort() == uri.getPort()) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
                catch (ActivityNotFoundException ignored) { }
                return true;
            }
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    webView.setVisibility(View.GONE);
                    errorPanel.setVisibility(View.VISIBLE);
                    progress.setVisibility(View.GONE);
                }
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int value) {
                progress.setProgress(value);
                progress.setVisibility(value == 100 ? View.GONE : View.VISIBLE);
            }
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = params.createIntent();
                try { startActivityForResult(intent, FILE_PICKER); }
                catch (ActivityNotFoundException ex) {
                    fileCallback = null;
                    callback.onReceiveValue(null);
                    return false;
                }
                return true;
            }
        });
        root.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1));

        errorPanel = new LinearLayout(this);
        errorPanel.setOrientation(LinearLayout.VERTICAL);
        errorPanel.setGravity(Gravity.CENTER);
        errorPanel.setPadding(dp(20), dp(20), dp(20), dp(20));
        errorPanel.addView(text("无法连接服务器。请检查地址和网络。", 16, Color.rgb(51, 65, 85)));
        Button retry = new Button(this);
        retry.setText("重试");
        retry.setOnClickListener(v -> {
            errorPanel.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            webView.loadUrl(serverOrigin + "/app/");
        });
        errorPanel.addView(retry);
        errorPanel.setVisibility(View.GONE);
        root.addView(errorPanel, new LinearLayout.LayoutParams(-1, 0, 1));

        refresh.setOnClickListener(v -> webView.reload());
        settings.setOnClickListener(v -> showSettings(true));
        setContentView(root);
        webView.loadUrl(serverOrigin + "/app/");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_PICKER && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            fileCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            CookieManager.getInstance().flush();
            webView.destroy();
        }
        super.onDestroy();
    }
}
