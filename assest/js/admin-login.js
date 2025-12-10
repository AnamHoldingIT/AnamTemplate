document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("admin-login-form");
    const usernameInput = document.getElementById("admin-username");
    const passwordInput = document.getElementById("admin-password");

    const toast = document.getElementById("admin-login-toast");
    const toastText = document.getElementById("admin-login-toast-text");

    // ===== toggle نمایش/مخفی کردن پسورد (با event delegation) =====
    document.addEventListener("click", function (e) {
        const togglePasswordBtn = e.target.closest(".admin-toggle-password");
        if (!togglePasswordBtn || !passwordInput) return;

        const toggleIcon = togglePasswordBtn.querySelector("i");
        const isHidden = passwordInput.type === "password";

        // عوض‌کردن نوع input
        passwordInput.type = isHidden ? "text" : "password";

        // عوض‌کردن آیکون
        if (toggleIcon) {
            if (isHidden) {
                toggleIcon.classList.remove("bi-eye");
                toggleIcon.classList.add("bi-eye-slash");
            } else {
                toggleIcon.classList.remove("bi-eye-slash");
                toggleIcon.classList.add("bi-eye");
            }
        }
    });

    // ===== Toast helper =====
    function showToast(message) {
        if (!toast || !toastText) return;
        toastText.textContent = message;
        toast.classList.add("is-visible");
        setTimeout(() => toast.classList.remove("is-visible"), 4000);
    }

    // اگه فرم نباشه، ادامه لازم نیست
    if (!form) return;

    // csrf رو امن بخونیم
    const csrfInput = document.querySelector("[name=csrfmiddlewaretoken]");
    const csrftoken = csrfInput ? csrfInput.value : "";

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = usernameInput ? usernameInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value.trim() : "";

        if (!username || !password) {
            showToast("لطفاً نام کاربری و رمز عبور را کامل وارد کنید.");
            return;
        }

        // ساخت هدرها بدون سینتکس عجیب
        const headers = {
            "Accept": "application/json"
        };
        if (csrftoken) {
            headers["X-CSRFToken"] = csrftoken;
        }

        fetch(form.action, {
            method: "POST",
            headers: headers,
            body: new FormData(form)
        })
        .then(async function (res) {
            const data = await res.json();

            // ورود موفق
            if (res.status === 200 && data.ok) {
                window.location.href = data.redirect;
                return;
            }

            // خطای ورود (رمز/یوزر اشتباه)
            if (res.status === 400) {
                showToast(data.error || "نام کاربری یا رمز عبور صحیح نیست.");
                return;
            }

            // دسترسی نداشتن
            if (res.status === 403) {
                showToast(data.error || "دسترسی شما به این بخش محدود شده است.");
                return;
            }

            // خطای دیگر
            showToast("خطای ناشناخته. دوباره تلاش کنید.");
        })
        .catch(function () {
            showToast("خطای ارتباط با سرور.");
        });
    });
});
