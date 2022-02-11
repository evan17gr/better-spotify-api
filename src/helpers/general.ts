export const arrayToString = (arr: string[]): string => {
  return arr.map((str) => str).join(' ');
};

export const cookiesToObject = (cookiesStr: string): { [x: string]: string } => {
  const cookies = cookiesStr.split(';');
  const cookiesObj = {};
  cookies.map((cookie) => {
    const trimmedCookie = cookie.trim();
    const key = trimmedCookie.split('=')[0];
    const value = trimmedCookie.split('=')[1];
    cookiesObj[key] = value;
  });

  return cookiesObj;
};
