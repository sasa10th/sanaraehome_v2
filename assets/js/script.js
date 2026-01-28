document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initMobileMenu();
    initScrollSpy();
    initSmoothScroll();
    initHeroParallax();
    initScrollReveal();
    initDetailsAnimation();
});

/* 타이핑 애니메이션 */
function initTypingAnimation() {
    const dataElem = document.getElementById("typing-data");
    const target = document.getElementById("typing-text");
    
    if (!dataElem || !target) return;

    const messages = dataElem.dataset.messages.split(',').map(s => s.trim());
    let msgIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = messages[msgIndex];
        const visible = current.substring(0, charIndex);
        target.textContent = visible;

        let typeSpeed = 100;

        if (!isDeleting) {
            charIndex++;
            if (charIndex > current.length) {
                isDeleting = true;
                typeSpeed = 1000;
            }
        } else {
            charIndex--;
            typeSpeed = 60;
            if (charIndex === 0) {
                isDeleting = false;
                msgIndex = (msgIndex + 1) % messages.length;
            }
        }

        setTimeout(type, typeSpeed);
    }
    type();
}

/* 모바일 드롭다운 메뉴 */
function initMobileMenu() {
    const burger = document.getElementById("hamburger");
    const menu = document.getElementById("dropdownMenu");

    if (!burger || !menu) return;

    burger.addEventListener("click", (event) => {
        event.stopPropagation();
        burger.classList.toggle("active");
        menu.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        menu.classList.remove("active");
        burger.classList.remove("active");
    });
}

/* 현재 섹션 */
function initScrollSpy() {
    const sections = document.querySelectorAll("section, footer");
    const pcLinks = document.querySelectorAll(".pc-nav a");

    if (sections.length === 0) return;

    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    pcLinks.forEach(a => a.classList.remove("active"));
                    
                    const activeLink = document.querySelector(`.pc-nav a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add("active");
                }
            });
        },
        {
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0
        }
    );

    sections.forEach(section => navObserver.observe(section));
}

/* 부드러운 스크롤 */
function initSmoothScroll() {
    const links = document.querySelectorAll(".pc-nav a, .dropdown-menu a");
    const burger = document.getElementById("hamburger");
    const menu = document.getElementById("dropdownMenu");
    const header = document.querySelector("header");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const id = href.substring(1);
            const targetSection = document.getElementById(id);

            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const extraOffset = 100; // 추가 여백

                const offsetTop =
                    targetSection.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    extraOffset;

                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });

                if (menu) menu.classList.remove("active");
                if (burger) burger.classList.remove("active");
            }
        });
    });
}

/* Hero 텍스트 패럴랙스 효과 */
function initHeroParallax() {
    const heroText = document.getElementById('hero-text');
    if (!heroText) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                heroText.style.opacity = 1 - scrollPosition / 400;
                heroText.style.transform = `translateY(-${scrollPosition / 2}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* 페이드인 */
function initScrollReveal() {
    const hiddenElements = document.querySelectorAll('.fade-in-box');
    if (hiddenElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    hiddenElements.forEach((el) => fadeObserver.observe(el));
}

/* 아코디언 */
function initDetailsAnimation() {
    const detailsList = document.querySelectorAll("details");

    detailsList.forEach(details => {
        const summary = details.querySelector("summary");
        if (!summary) return;

        summary.addEventListener("click", () => {
        });
    });
}

/* 사진 열기 */
function openModal(imgSrc) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    if (!imgSrc) {
        return; 
    }
    modal.style.display = "flex";
    modalImg.src = imgSrc;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

/* 안내사항 */
/* 공지사항 */
async function fetchNotices() {
    const container = document.getElementById("notice-list-container");

    try {
        const response = await fetch("./assets/files/notices.json");
        if (!response.ok) throw new Error();

        const data = await response.json();

        container.innerHTML = data.map(item => `
            <div class="notice-item">
                <div class="notice-header">
                    <div class="notice-title-group">
                        <span class="notice-badge ${item.important ? 'important' : ''}">
                            ${item.tag}
                        </span>
                        <span class="notice-title">${item.title}</span>
                    </div>
                    <span class="notice-date">
                        <span class="notice-hint">클릭하여 펼치기</span>&emsp;${item.date}
                    </span>
                </div>
                <div class="notice-content">
                    <div class="notice-text">${item.content}</div>
                    ${item.file ? `
                        <div class="notice-file-area">
                            <a href="assets/files/${item.file}" class="file-download-link" download>
                                <i class="bi bi-file-earmark-arrow-down"></i> ${item.file} 다운로드
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join("");

        document.querySelectorAll(".notice-header").forEach(header => {
            header.addEventListener("click", () => {
                const item = header.parentElement;
                const hint = header.querySelector(".notice-hint");

                const isOpen = item.classList.toggle("active");
                if (hint) {
                    hint.textContent = isOpen
                        ? "클릭하여 접기"
                        : "클릭하여 펼치기";
                }
            });
        });

    } catch {
        container.innerHTML = "<p style='text-align:center;'>공지사항이 없습니다.</p>";
    }
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', fetchNotices);