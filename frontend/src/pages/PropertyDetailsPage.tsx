import { ArrowLeft, MapPin, Calendar, CreditCard, Users, Activity } from 'lucide-react';

interface PropertyDetailsPageProps {
  onBack: () => void;
}

export default function PropertyDetailsPage({ onBack }: PropertyDetailsPageProps) {
  const propertyDetail = {
    plotId: 'Plot 15',
    address: 'Treboul - 8254FF 21',
    coordinates: '44.814,24.0894 to 44.0846 N',
    events: 5,
    people: 3000,
    owners: 7,
    paymentMethod: 'visa',
    transactionId: '5dG56j9sGA0j...',
    date: 'June 6, 2024',
    value: 4000,
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Transactions</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Property Details</h1>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-64 sm:h-80 bg-gradient-to-br from-emerald-100 to-teal-100 relative">
              <img
                src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Property"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur rounded-lg shadow-lg">
                <span className="text-sm font-semibold text-gray-900">Property ID: {propertyDetail.plotId}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{propertyDetail.plotId}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span className="text-sm sm:text-base">{propertyDetail.address}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-sm text-gray-500 mb-1">Property Value</div>
                  <div className="text-3xl font-bold text-emerald-600">${propertyDetail.value.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Activity size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Events</div>
                      <div className="text-xl font-bold text-gray-900">{propertyDetail.events}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total People</div>
                      <div className="text-xl font-bold text-gray-900">{propertyDetail.people.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Owners</div>
                      <div className="text-xl font-bold text-gray-900">{propertyDetail.owners}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location Details</h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-gray-500 mt-1" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Coordinates</div>
                      <div className="text-sm text-gray-600 font-mono">{propertyDetail.coordinates}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Transaction Date</div>
                        <div className="text-sm text-gray-600">{propertyDetail.date}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <CreditCard size={20} className="text-gray-500 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Payment Method</div>
                        <div className="text-sm text-gray-600 uppercase">{propertyDetail.paymentMethod}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 md:col-span-2">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded mt-0.5"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">Transaction ID</div>
                        <div className="text-sm text-gray-600 font-mono break-all">{propertyDetail.transactionId}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
