import React, { useState } from 'react';

export const PrivacyNotice = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 md:p-6 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">🔒 Privacy First</h3>
          <p className="text-sm font-medium text-gray-600 break-words">
            Your photos stay private. We don't store, collect, or share any of your photos - 
            everything happens locally in your browser.
          </p>
        </div>
        <div className="flex items-center gap-4 self-stretch sm:self-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
          >
            Learn more
          </button>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Privacy Policy</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-6 text-gray-600">
              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
                <p className="text-sm sm:text-base">
                  Snapify is designed with your privacy in mind. We believe your photos are personal
                  and should stay that way.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">How We Handle Your Photos</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                  <li>All photo processing happens locally in your browser</li>
                  <li>Photos are never uploaded to any server</li>
                  <li>Photos are not stored anywhere after you leave the page</li>
                  <li>We don't use any tracking or analytics on your photos</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Camera Access</h3>
                <p className="text-sm sm:text-base">
                  We only request camera access to provide the photo booth functionality.
                  This access is handled directly by your browser and can be revoked at any time.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Data Collection</h3>
                <p className="text-sm sm:text-base">
                  We collect no personal information and use no cookies or tracking
                  mechanisms. This site is completely static and runs entirely in
                  your browser.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <p className="text-sm sm:text-base">
                  If you have any questions about our privacy practices, please feel
                  free to contact us.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
