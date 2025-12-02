import { AppStoreButton, GooglePlayButton } from '@/src/atoms';

export function AppPromoSection() {
  return (
    <div className="bg-brand-navy text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Lleva tu APP morem ipsum
          </h2>

          <p className="text-white mb-8 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.
          </p>

          <div className="flex gap-4 flex-wrap">
            <AppStoreButton className="px-6 py-3 gap-3" />
            <GooglePlayButton className="px-6 py-3 gap-3" />
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-64 h-96 bg-white/10 rounded-3xl flex items-center justify-center">
            <span className="text-brand-border">App Screenshot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
