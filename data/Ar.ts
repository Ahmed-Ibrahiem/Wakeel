export const homePage = {
  navbar: [
    {
      title: "الرئيسية",
      href: "#hero-section",
    },
    {
      title: "المميزات",
      href: "#features",
    },
    {
      title: "كيف يعمل",
      href: "#how-it-work",
    },
    {
      title: "تواصل معنا",
      href: "#contact-us",
    },
  ],

  authButton: {
    startNow: "إبدأ الأن",
    login: "تسجيل دخول",
  },

  hero: {
    heighLight: "نظام إدارة الجلسات للمحاميين",
    title: "نظّم قضاياك وجلساتك، ودَع وكيل يفعل الباقي",
    subtitle:
      "وكيل نظام بسيط يساعد المحامي على متابعة عملائه وقضاياه ومواعيد جلساته في مكان واحد، مع تنبيهات قبل كل جلسة.",
    ctaPrimary: "ابدأ مجانًا",
    ctaSecondary: "شاهد كيف يعمل",
    wakeel: "وكيل",
  },

  features: {
    title: "كل أدواتك القانونية في مكان واحد",
    desc: "نظام بسيط لكنه شامل. مصمم خصيصاً لطريقة عمل المحامي.",
    items: [
      {
        id: 1,
        title: "إدارة العملاء",
        description: "احتفظ ببيانات عملائك وقضاياهم في مكان واحد.",
        iconName: "HiOutlineUser",
      },
      {
        id: 2,
        title: "تتبع القضايا",
        description: "تسجيل تفاصيل كل قضية، وحالاتها وملاحظاتها.",
        iconName: "HiOutlineFolder",
      },
      {
        id: 3,
        title: "التنبيه بالمواعيد",
        description:
          "التنبيه بمواعيد الجلسات، والتنبيه في حالة تعارض مواعيد الجلسات.",
        iconName: "HiOutlineCalendar",
      },
      {
        id: 4,
        title: "متابعة الأتعاب",
        description: "تعرف من دفع ومن لا يزال عليه مستحقات.",
        iconName: "HiOutlineCurrencyDollar",
      },
      {
        id: 5,
        title: "التقارير",
        description: "إحصائيات وتقارير مفصلة",
        iconName: "HiOutlineChartBar",
      },
      {
        id: 6,
        title: "البحث",
        description: "الوصول السريع لأي معلومة",
        iconName: "HiOutlineMagnifyingGlass",
      },
      {
        id: 7,
        title: "المرفقات",
        description: "رفع وحفظ المستندات",
        iconName: "HiOutlinePaperClip",
      },
      {
        id: 8,
        title: "الإعدادات",
        description: "تخصيص النظام حسب احتياجك",
        iconName: "HiOutlineCog6Tooth",
      },
    ],
  },

  whyUs: {
    mainTitle: "لماذا يستخدم المحامي وكيل؟",
    subtitle:
      "صُمم وكيل لحل مشكلة حقيقية: مواعيد الجلسات المبعثرة بين واتساب والمفكرة الورقية والذاكرة. يجمعها وكيل كلها في مكان واحد.",
    ctaText: "إعرف أكثر",
    systemCapabilitiesTitle: "قدرة النظام نفسه",
    capabilities: [
      {
        id: 1,
        title: "مفتوح المصدر",
        description: "تم بنائه بإستخدام Next.js",
        iconName: "FaCode",
      },
      {
        id: 2,
        title: "تنبيهين",
        description: "قبل كل جلسة (يوم وساعات)",
        iconName: "FaBell",
      },
      {
        id: 3,
        title: "3 دقائق",
        description: "الوقت المتوقع لتسجيل جلسة جديدة",
        iconName: "RiFlashlightLine",
      },
    ],
  },

  howItWorks: {
    title: "كيف يعمل النظام",
    desc: "تبدأ في 3 خطوات بسيطة",
    steps: [
      {
        step: 1,
        iconName: "FaRegUser",
        label: "سجل حسابك",
        desc: "دقيقة واحدة وتستطيع البدء",
      },
      {
        step: 2,
        iconName: "FaRegFolder",
        label: "أضف عملاءك وقضاياهم",
        desc: "أدخل التفاصيل الأساسية",
      },
      {
        step: 3,
        iconName: "FaRegBell",
        label: "استرح وانتظر التنبيهات",
        desc: "يذكّرك النظام بمواعيدك أولًا بأول",
      },
    ],
  },

  screenshots: {
    title: "لمحة من داخل النظام",
    subtitle: "لقطات فعلية من واجهة وكيل",
    items: [
      {
        id: 1,
        title: "الرئيسية",
        description: "نظرة عامة على عملك",
        image: "/images/admin/dashboard.png",
        alt: "لوحة التحكم الرئيسية لنظام وكيل",
      },
      {
        id: 2,
        title: "قائمة القضايا",
        description: "تتبع حالة كل قضية",
        image: "/images/admin/case.png",
        alt: "صفحة قائمة القضايا في النظام",
      },
      {
        id: 3,
        title: "الجلسات القادمة",
        description: "مواعيدك في تقويم واضح",
        image: "/images/admin/sessions-appointments.png",
        alt: "تقويم الجلسات القادمة في نظام وكيل",
      },
      {
        id: 4,
        title: "تفاصيل قضية",
        description: "كل المعلومات في صفحة واحدة",
        image: "/images/admin/case-details.png",
        alt: "صفحة تفاصيل قضية محددة",
      },
    ],
  },

  trustSectionData: {
    title: "بياناتك في أمان تام",
    description:
      "كل محامٍ يرى بياناته الخاصة فقط. جميع بيانات عملائك وقضاياك محفوظة بشكل آمن ومشفر، ولا يطّلع عليها أحد غيرك لضمان السرية المطلقة.",
    features: [
      "تشفير كامل للبيانات وحمايتها بأعلى معايير الأمان",
      "عزل تام لحسابات المحامين لضمان الخصوصية",
      "صلاحيات وصول مخصصة ومراقبة على مدار الساعة",
    ],
    image: "/images/admin/dashboard.png",
    alt: "نظام حماية وتأمين بيانات المحامين في وكيل",
  },

  ctaData: {
    title: "جاهز تنظم شغلك؟",
    subtitle: "ابدأ باستخدام وكيل مجانًا.",
    buttonText: "ابدأ الآن",
    buttonLink: "/register",
    bgImage: "/images/admin/cta-bg.png",
    alt: "خلفية قسم ابدأ الآن لنظام وكيل",
  },

  footerData: {
    brand: {
      name: "وكيل",
      description: "نظام إدارة قضايا ومواعيد للمحامين",
    },
    columns: [
      {
        title: "روابط سريعة",
        links: [
          { label: "الرئيسية", href: "/" },
          { label: "المميزات", href: "/features" },
          { label: "كيف يعمل", href: "/how-it-work" },
          { label: "تسجيل الدخول", href: "/login" },
          { label: "إنشاء حساب", href: "/register" },
        ],
      },
      {
        title: "قانوني",
        links: [
          { label: "سياسة الخصوصية", href: "/privacy-policy" },
          { label: "شروط الاستخدام", href: "/terms-of-use" },
        ],
      },
      {
        title: "تواصل معنا",
        contact: {
          email: "info@wakeel.app",
          emailIcon: "HiOutlineEnvelope",
        },
        socials: [
          { name: "LinkedIn", href: "#", iconName: "FaLinkedinIn" },
          { name: "X", href: "#", iconName: "FaXTwitter" },
          { name: "Facebook", href: "#", iconName: "FaFacebookF" },
        ],
      },
    ],
    copyright: "© وكيل، جميع الحقوق محفوظة.",
  },
};
