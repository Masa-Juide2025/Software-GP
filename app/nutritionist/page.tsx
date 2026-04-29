"use client"
import { useEffect, useState } from "react";
import { Users, Star, Utensils, Clock, Video } from "lucide-react";

export default function NutritionistDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) {
        try {
          const res = await fetch(`/api/nutritionist/profile?email=${storedEmail}`);
          const data = await res.json();
          // نحدث الـ state بالداتا اللي تأكدنا إنها بتوصل
          setProfile(data);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center font-black text-[#107c41]">جاري التحميل...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500 font-black">يرجى تسجيل الدخول</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#fafafa] min-h-screen font-sans" dir="rtl">
      
      {/* الهيدر */}
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">
            مرحباً، {profile.displayName} 👋
          </h1>
          <p className="text-gray-400 font-bold text-[15px]">{profile.specialization}</p>
        </div>
        <div className="bg-[#ecfdf5] text-[#107c41] px-8 py-3 rounded-[20px] font-black text-sm border border-[#107c41]/10">
          أخصائي تغذية
        </div>
      </div>

      {/* الكروت الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Users size={28}/>} color="green" label="المشتركين" value={profile.currentSubscribers} subValue={`من ${profile.maxSubscribers}`} />
        <StatCard icon={<Star size={28}/>} color="yellow" label="التقييم" value={profile.rating} subValue="نجوم" />
        <StatCard icon={<Utensils size={28}/>} color="green" label="الخطط" value={profile.dietPlansCount} subValue="خطة منشأة" />
        <StatCard 
          icon={<Clock size={28}/>} 
          color="blue" 
          label="المواعيد" 
          value={profile.appointmentsCount || "0"} 
          subValue={profile.appointmentsCount > 0 ? "مواعيد مسجلة اليوم" : "لا يوجد مواعيد"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* قائمة المشتركين */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-2 px-2">
            <Users className="text-[#107c41]" size={22} /> قائمة المشتركين
          </h2>
          <div className="space-y-4">
            {profile.subscribersList?.map((sub: any) => (
              <div key={sub._id} className="flex items-center justify-between p-5 bg-[#f9fafb] rounded-[30px] border border-transparent hover:border-gray-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-[#107c41] shadow-sm font-black text-lg">
                    {sub.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-[15px] mb-0.5">{sub.name}</h4>
                    <div className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-[#107c41] rounded-full"></div>
                      {sub.dailyCalories} سعرة / يوم
                    </div>
                  </div>
                </div>
                <div className="text-left flex flex-col items-end gap-1">
                  <span className="px-4 py-0.5 rounded-full text-[10px] font-black bg-[#e7f5ed] text-[#107c41] border border-[#107c41]/10">
                    {sub.package}
                  </span>
                  <div className="text-right">
                    <p className="text-[14px] font-black text-gray-800 leading-tight">{sub.weight} كجم</p>
                    <p className="text-[10px] text-[#107c41] font-black uppercase tracking-widest leading-none mt-1">{sub.goal}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* كرت المواعيد - هنا كان الخلل وغالباً بسبب الـ check */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
           <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-2 px-2">
            <Clock className="text-[#3b82f6]" size={22} /> مواعيد اليوم
          </h2>
          
          <div className="space-y-4 w-full h-full flex-grow">
            {profile.todayAppointments && profile.todayAppointments.length > 0 ? (
              profile.todayAppointments.map((app: any) => (
                <div key={app._id} className="flex items-center justify-between p-5 bg-[#f0f7ff] rounded-[30px] border border-transparent hover:border-blue-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-[15px] flex items-center justify-center text-[#3b82f6] shadow-sm">
                      <Video size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-[15px] mb-0.5">{app.subscriberName}</h4>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{app.type}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black text-[#3b82f6] tracking-tighter">{app.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 opacity-40">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <Clock size={40} />
                </div>
                <p className="text-gray-400 font-black text-sm uppercase tracking-widest">لا توجد مواعيد</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, color, label, value, subValue }: any) {
  const colors: any = { 
    green: "bg-[#e7f5ed] text-[#107c41]", 
    yellow: "bg-[#fff9e6] text-[#ffcc00]", 
    blue: "bg-[#eef6ff] text-[#3b82f6]" 
  };
  return (
    <div className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
      <div className="flex flex-col">
        <p className="text-gray-400 text-[11px] font-bold mb-1 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-black text-gray-800 leading-none">{value}</h3>
        <p className="text-[10px] text-gray-400 font-bold mt-2">{subValue}</p>
      </div>
      <div className={`w-14 h-14 ${colors[color]} rounded-[22px] flex items-center justify-center shadow-inner`}>{icon}</div>
    </div>
  );
}