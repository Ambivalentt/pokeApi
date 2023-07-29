const menuMobileIcon = document.getElementById('menuIcon') as HTMLButtonElement
const menuMobileContent = document.getElementById('menuMobilContent') as HTMLDivElement

export const menuMobile = ():void => {
    menuMobileIcon.addEventListener('click', () => {
        menuMobileContent.classList.toggle('invisible');
        menuMobileContent.classList.toggle('h-32');
        menuMobileContent.classList.toggle('opacity-100')
      });
  };
