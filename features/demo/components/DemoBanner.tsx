import { FiInfo } from "react-icons/fi";

export default function DemoBanner() {
  return (
    <div
      role="status"
      className="flex-center gap-2 border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900"
    >
      <FiInfo className="shrink-0" />
      <span>
        نسخة تجريبية: لا تُدخل بيانات حقيقية، وتُعاد البيانات إلى وضعها الأصلي عند كل دخول.
      </span>
    </div>
  );
}