const openBtn = document.getElementById('openBtn');
const welcomeScreen = document.getElementById('welcome');
const bookSection = document.getElementById('bookSection');
const bgMusic = document.getElementById('bgMusic');
const closeBook = document.getElementById('closeBook');
const finalMessage = document.getElementById('finalMessage');

// Memulai Pengalaman
openBtn.addEventListener('click', () => {
    // Putar Musik
    bgMusic.play().catch(e => console.log("Audio auto-play blocked"));
    
    // Animasi Keluar Screen Utama
    welcomeScreen.style.transition = "1s ease";
    welcomeScreen.style.opacity = "0";
    welcomeScreen.style.transform = "scale(1.1)";

    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        bookSection.classList.remove('hidden');
        // Tambahkan animasi partikel di background jika perlu
    }, 1000);
});

// Fungsi membalik halaman
function flipPage(page) {
    if (!page.classList.contains('flipped')) {
        page.classList.add('flipped');
        // Mengatur z-index agar halaman yang dibuka tidak menutupi halaman selanjutnya
        setTimeout(() => {
            page.style.zIndex = "1";
        }, 500);
    } else {
        page.classList.remove('flipped');
        page.style.zIndex = "";
    }
}

// Menutup Buku
closeBook.addEventListener('click', (e) => {
    e.stopPropagation();
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.add('hidden'));
    finalMessage.classList.remove('hidden');
});