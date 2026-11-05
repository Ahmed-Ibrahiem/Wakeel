export const emailLink = async (o: {
  heading: string;
  intro: string;
  button: string;
  url: string;
}) => {
  const html = `
    <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8">
      <h2>${o.heading}</h2>
      <p>${o.intro}</p>
      <p>
        <a href="${o.url}"
           style="background:#087a5b;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">
          ${o.button}
        </a>
      </p>
      <p>لو الزرار مش شغال، انسخ الرابط ده في المتصفح:<br>${o.url}</p>
      <p>لو ما طلبتش ده، تجاهل الرسالة.</p>
    </div>
    `;

  const text = `${o.intro}\n${o.url}\n`;

  return { html, text };
};
