import Image from "next/image";
import { Package, Truck, CreditCard, ShieldCheck, Check } from "lucide-react";

const FEATURES = [
  { id: 1, label: "گارانتی سلامت فیزیکی", icon: Package },
  { id: 2, label: "ارسال سریع", icon: Truck },
  { id: 3, label: "خرید از طریق شتاب", icon: CreditCard },
  { id: 4, label: "ضمانت ارسال", icon: ShieldCheck },
];

export default function Footer() {
  return (
    <footer
      className="w-full bg-dark-gray border-t-4 border-primary-red"
      dir="rtl"
    >
      {/* Top Features Section */}
      <div className="w-full border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 md:py-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {FEATURES.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col items-center justify-center gap-2.5 md:gap-3"
              >
                <div className="relative">
                  <feature.icon
                    size={48}
                    className="text-white/80"
                    strokeWidth={1}
                  />
                  <div className="absolute top-0 right-0 -mr-1 -mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-red ring-2 ring-dark-gray">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-sm font-medium text-white/90 md:text-[15px]">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Links & Logos Section */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          {/* Col 1: اطلاعات تماس */}
          <div className="md:col-span-3 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="block h-4 w-1 bg-primary-red"></span>
              <h3 className="text-[15px] font-bold text-white">
                اطلاعات تماس:
              </h3>
            </div>
            <ul className="flex flex-col gap-2.5 text-[13px] text-white/70">
              <li>تلفن: ٦٦٤٠٨٦٤٠ - ٦٦٤٦٠٠٩٩ - ۹۱۲۱۲۹۹۱</li>
              <li>دورنگار: ٦٦٤١٣٩٣٣</li>
              <li>صندوق پستی: 756-13145</li>
              <li>کدپستی: ۱۳۱۴۶۷۵۵۳۳</li>
              <li className="flex items-center gap-1">
                وب سایت: <span dir="ltr">www.qoqnoos.ir</span>
              </li>
              <li className="flex items-center gap-1">
                ایمیل: <span dir="ltr">pub@qoqnoos.ir</span>
              </li>
            </ul>
          </div>

          {/* Col 2: گروه انتشارات ققنوس */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="block h-4 w-1 bg-primary-red"></span>
              <h3 className="text-[15px] font-bold text-white">
                گروه انتشارات ققنوس:
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              <div className="flex h-22 items-center justify-center rounded-[10px] bg-[#3B3D40] p-2 transition-colors hover:bg-white/20">
                <Image
                  src="/mysecretpreview/footer/ققنوس.png"
                  alt="ققنوس"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="flex h-22 items-center justify-center rounded-[10px] bg-[#3B3D40] p-2 transition-colors hover:bg-white/20">
                <Image
                  src="/mysecretpreview/footer/آفرینگان.png"
                  alt="آفرینگان"
                  width={54}
                  height={54}
                  className="object-contain"
                />
              </div>
              <div className="flex h-22 items-center justify-center rounded-[10px] bg-[#3B3D40] p-2 text-sm font-bold text-[#1E1F21] text-center transition-colors hover:bg-white/20">
                هیلا
              </div>
              <div className="flex h-22 items-center justify-center rounded-[10px] bg-[#3B3D40] p-2 text-sm font-bold text-[#1E1F21] text-center transition-colors hover:bg-white/20">
                نشر کودک
              </div>
            </div>
          </div>

          {/* Col 3: گروه پخش ققنوس */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="block h-4 w-1 bg-primary-red"></span>
              <h3 className="text-[15px] font-bold text-white">
                گروه پخش ققنوس:
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex h-22 items-center justify-center rounded-[10px] bg-[#3B3D40] p-2 transition-colors hover:bg-white/20">
                <Image
                  src="/mysecretpreview/footer/پخش-کتاب-1.png"
                  alt="پخش کتاب"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div className="flex h-22 items-center justify-center rounded-[10px] bg-[#3B3D40] p-2 transition-colors hover:bg-white/20">
                <Image
                  src="/mysecretpreview/footer/پخش-ملزومات-1.png"
                  alt="پخش ملزومات"
                  width={56}
                  height={56}
                  className="object-contain -mt-2"
                />
              </div>
            </div>
          </div>

          {/* Col 4: با اطمینان خرید کنید */}
          <div className="md:col-span-3 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="block h-4 w-1 bg-primary-red"></span>
              <h3 className="text-[15px] font-bold text-white">
                با اطمینان خرید کنید:
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div
                className="flex h-[88px] items-center justify-center overflow-hidden rounded-[10px] bg-[#3B3D40] transition-colors hover:bg-white/20 [&_img]:max-w-17.5 [&_img]:max-h-17.5 [&_img]:object-contain"
                dangerouslySetInnerHTML={{
                  __html: `<a target="_blank" href="https://trustseal.enamad.ir/?id=60679&Code=6dJIRIIxDE2dHzNamInk"><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=60679&Code=6dJIRIIxDE2dHzNamInk' alt='' style='cursor:pointer' code='6dJIRIIxDE2dHzNamInk'></a>`,
                }}
              />
              <div className="flex h-[88px] items-center justify-center rounded-[10px] bg-[#3B3D40] p-2 text-xs font-bold text-[#1E1F21] text-center leading-relaxed transition-colors hover:bg-white/20">
                نشان ملی
                <br />
                ثبت رسانه
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section (Addresses) */}
      <div className="w-full border-t border-white/5">
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="block h-4 w-1 bg-primary-red"></span>
                <h3 className="text-[15px] font-bold text-white">
                  گروه انتشاراتی ققنوس:
                </h3>
              </div>
              <p className="text-[13px] leading-relaxed text-white/60">
                تهران، خیابان انقلاب، خیابان 12 فروردین، خیابان وحید نظری، نبش
                جاوید 2، پلاک 2
              </p>
            </div>

            {/* Address 2 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="block h-4 w-1 bg-primary-red"></span>
                <h3 className="text-[15px] font-bold text-white">فروشگاه:</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-white/60">
                تهران، خیابان انقلاب، خیابان منیری جاوید، نبش بازارچه کتاب، پلاک
                ٧٩
              </p>
            </div>

            {/* Address 3 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="block h-4 w-1 bg-primary-red"></span>
                <h3 className="text-[15px] font-bold text-white">
                  کافه کتاب ققنوس:
                </h3>
              </div>
              <p className="text-[13px] leading-relaxed text-white/60">
                تهران، خیابان انقلاب، خیابان وصال، کوچه شفیعی، پلاک 1
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
