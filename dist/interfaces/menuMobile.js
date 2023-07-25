const menuMobileIcon = document.getElementById('menuIcon');
const menuMobileContent = document.getElementById('menuMobilContent');
export const menuMobile = () => {
    menuMobileIcon.addEventListener('click', () => {
        menuMobileContent.classList.toggle('invisible');
        menuMobileContent.classList.toggle('h-28');
        menuMobileContent.classList.toggle('opacity-100');
    });
};
