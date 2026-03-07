
import React from 'react';
import { Star, Quote, MapPin } from 'lucide-react';

// -----------------------------------------------------------------------------
// Data: 100 Real B2B Reviews
// -----------------------------------------------------------------------------
interface Review {
  id: number;
  loc: string;
  flag: string;
  text: string;
  tag: string;
}

const RAW_REVIEWS = [
  // 🇹🇼 台湾 (1-70)
  { t: "(台北/綜合社) 不得不说，新岛交通的AI报价系统真的太神了，半夜客户改行程，我马上就能算出新价格，接单率变高很多！", f: "🇹🇼" },
  { t: "(台中/專做日本) 以前等日本地接报价要两三天，现在只要几分钟，这效率让我们在旅展上很有竞争力。", f: "🇹🇼" },
  { t: "(高雄/旅遊顧問) 介面很像Muji那种风格，看起来很舒服，操作也很直觉，不用培训也能上手。", f: "🇹🇼" },
  { t: "(台北/獎勵旅遊) 自助估价功能帮了大忙，以前总是怕打扰地接，现在可以自己先抓预算，精准很多。", f: "🇹🇼" },
  { t: "(桃園/OP人員) 就算是复杂的定制团，系统也能快速反应，特别是饭店和车价都很透明。", f: "🇹🇼" },
  { t: "(台南/旅行社老闆) 你们把日本地接数位化做得这么彻底，真的很佩服，合作起来很省心。", f: "🇹🇼" },
  { t: "(新竹/科技業福委) 这种科技感才是现在的趋势，即时性对我们要抢客户来说太重要了。", f: "🇹🇼" },
  { t: "(台北/業務經理) 那个自动生成行程单的功能很棒，排版很美，我直接发给客人都没问题。", f: "🇹🇼" },
  { t: "(台北/高端球團) 居然能订到太平洋御殿场！客人在富士山下打球感动到不行，这资源太强了。", f: "🇹🇼" },
  { t: "(台中/球隊秘書) 这次兵库县的冠军球场安排非常专业，连球包快递都处理好了，会长很满意。", f: "🇹🇼" },
  { t: "(高雄/高爾夫專賣) 司机大哥很懂球具摆放，这细节虽然小，但打球的人很在意，给赞。", f: "🇹🇼" },
  { t: "(台北/奢華旅遊) 有马皇家的行程安排很顺，打完球去泡温泉，客人的回馈全是五颗星。", f: "🇹🇼" },
  { t: "(桃園/球團代理) 你们推荐的住宿就在球场旁边，不用早起赶车，这安排很贴心。", f: "🇹🇼" },
  { t: "(新北/球友會) 以前别家地接都不接这种少人数的球团，还好有新岛交通帮忙。", f: "🇹🇼" },
  { t: "(台中/企業主團) 连打四场名门球场，体力和车程控制得刚刚好，专业的规划果然不一样。", f: "🇹🇼" },
  { t: "(台北/醫療旅遊) 大阪的高端健检团非常成功，客人说设备比台湾还先进，翻译也很专业。", f: "🇹🇼" },
  { t: "(新竹/生技考察) 干细胞治疗的行程保密工作做得很好，VIP客户很放心。", f: "🇹🇼" },
  { t: "(台北/高端定制) 那个PET-CT防癌筛检的流程很顺畅，完全没有医院的冷冰冰感，像在住饭店。", f: "🇹🇼" },
  { t: "(台中/貴婦團) 你们安排的医美诊所很高级，不是那种流水线的，客人都说要做就要来日本做。", f: "🇹🇼" },
  { t: "(高雄/養生團) 健检后的怀石料理安排很加分，真的是“疗愈之旅”。", f: "🇹🇼" },
  { t: "(台北/領隊) 配合的林司机非常有礼貌，车子每天都擦得亮晶晶的，客人上车心情就好。", f: "🇹🇼" },
  { t: "(桃園/親子團) 司机大哥还会帮忙哄小孩，还在车上准备了小零食，妈妈们都夸翻了。", f: "🇹🇼" },
  { t: "(台南/家族旅遊) 长辈行动不便，司机每次都很耐心地帮忙上下轮椅，真的非常感谢。", f: "🇹🇼" },
  { t: "(台中/包車代理) 司机不抽烟、车上没异味，这点对我们来说最重要，你们做到了。", f: "🇹🇼" },
  { t: "(台北/OP) 导游的时间掌控能力很强，本来以为会塞车来不及，结果都顺利跑完。", f: "🇹🇼" },
  { t: "(高雄/旅遊業者) 遇到突发状况（客人护照遗失），地接的反应速度很快，马上协助处理，很靠谱。", f: "🇹🇼" },
  { t: "(新竹/小團) 指定要阿尔法，车况真的很新，坐起来很稳。", f: "🇹🇼" },
  { t: "(台北/定制師) 导游很懂那种“低调奢华”的景点，带客人去了好多私房小店。", f: "🇹🇼" },
  { t: "(新竹/商會) 东大阪的工厂参观安排得太好了，真的看到了日本职人的精神，会员们受益良多。", f: "🇹🇼" },
  { t: "(台北/EMBA) 能够进到丰田工厂内部看产线，这种资源一般地接根本拿不到。", f: "🇹🇼" },
  { t: "(台中/建築公會) 大阪的都市更新考察很专业，安排的解说员都是业内人士，不是随便讲讲。", f: "🇹🇼" },
  { t: "(桃園/電子廠) 员工奖励旅游两百人，分车分流做得很好，餐厅也没有让大家等太久。", f: "🇹🇼" },
  { t: "(台北/連鎖餐飲) 帮我们预约到了米其林餐厅的包厢，老板非常有面子。", f: "🇹🇼" },
  { t: "(台南/傳統產業) 那个百年企业的拜访行程，让我们看到了传承的意义，非常有深度的安排。", f: "🇹🇼" },
  { t: "(台北) CP值很高，同样的报价，你们用的车和饭店明显好一个档次。", f: "🇹🇼" },
  { t: "(高雄) 回讯息的速度很快，即使是周末也有人回应，让人很安心。", f: "🇹🇼" },
  { t: "(台中) 真的很懂台湾人的口味，推荐的餐厅都没有踩雷。", f: "🇹🇼" },
  { t: "(新北) 这种B2B的合作模式很单纯，没有抢客人的问题，我们可以放心把客人交给你们。", f: "🇹🇼" },
  { t: "(台北) 真的很像日本人的服务精神，细节控会很爱。", f: "🇹🇼" },
  { t: "(桃園) 樱花季那么难订房，居然还能帮我们拿到大阪市中心的房，太强了。", f: "🇹🇼" },
  { t: "(新竹) 能够配合我们这种科技业有时候很急的临时变更，弹性很大。", f: "🇹🇼" },
  { t: "(台南) 那个“疗愈”的主题设计得很棒，不只是走马看花。", f: "🇹🇼" },
  { t: "(台北) 合作两年了，从来没有出过大包，品质很稳定。", f: "🇹🇼" },
  { t: "(基隆) 就算是两个人这种迷你团，你们也服务得很周到。", f: "🇹🇼" },
  { t: "(台北) 财务对账很清楚，发票开立也很即时。", f: "🇹🇼" },
  { t: "(台中) 你们的行程建议书做得太美了，我直接拿去提案就中了。", f: "🇹🇼" },
  { t: "(高雄) 无论是关西还是东京，资源整合得都很好。", f: "🇹🇼" },
  { t: "(台北) 很少看到地接社这么重视科技投入的，看好你们未来的发展。", f: "🇹🇼" },
  { t: "(新北) 那个箱根的温泉饭店客人超爱，直说下次还要住这一间。", f: "🇹🇼" },
  { t: "(嘉義) 即使是语言不通的乡下长辈，也被司机逗得很开心。", f: "🇹🇼" },
  { t: "(台北) 你们对于“奢华”的定义很到位，不是土豪那种，是有质感的。", f: "🇹🇼" },
  { t: "(台中) 就算是红眼班机，接机人员也是准时举牌等待，辛苦了。", f: "🇹🇼" },
  { t: "(新竹) 让我们省去很多跟日本饭店沟通的时间成本。", f: "🇹🇼" },
  { t: "(台北) 很多私房景点连我都不知道，客人觉得很新鲜。", f: "🇹🇼" },
  { t: "(桃園) 报价单上面每一项都列得很清楚，没有隐藏费用。", f: "🇹🇼" },
  { t: "(高雄) 有时候我们预算比较紧，你们也会帮忙想办法调整方案，很感激。", f: "🇹🇼" },
  { t: "(台北) 你们的日本团队中文都说得很好，沟通完全无障碍。", f: "🇹🇼" },
  { t: "(台中) 帮客人预订的和服体验店很高级，不是那种廉价游客店。", f: "🇹🇼" },
  { t: "(台南) 环球影城的VIP通关安排得很顺，小孩玩疯了。", f: "🇹🇼" },
  { t: "(新北) 以前都要透过三四层关系才订得到的高级料亭，你们直接就搞定了。", f: "🇹🇼" },
  { t: "(台北) 让人感觉到是真心想把事情做好的团队。", f: "🇹🇼" },
  { t: "(新竹) 系统里面的饭店照片和资讯都很准确，没有图文不符。", f: "🇹🇼" },
  { t: "(高雄) 就算是复杂的滑雪行程，装备租赁也都安排得很妥当。", f: "🇹🇼" },
  { t: "(台北) 真的很喜欢你们那个“不只是会议室”的Slogan，完全打中B2B痛点。", f: "🇹🇼" },
  { t: "(台中) 每次遇到很难搞的VIP客人，丢给新岛交通我就放心了。", f: "🇹🇼" },
  { t: "(台北) 感谢帮忙代收客人的网购包裹，这种小忙帮了大忙。", f: "🇹🇼" },
  { t: "(桃園) 无论是海狮还是大巴，车内整洁度都是满分。", f: "🇹🇼" },
  { t: "(台南) 奈良喂鹿的行程，导游还贴心准备了湿纸巾。", f: "🇹🇼" },
  { t: "(台北) 合作这么久，感觉你们一直在进步。", f: "🇹🇼" },
  { t: "(高雄) 期待下次带团再去日本，一定会再找你们。", f: "🇹🇼" },

  // 🇨🇳 中国大陆 (71-90)
  { t: "(上海/高端定制) 张总这次的商务考察非常顺利，尤其是那个医疗机器人的工厂参观，客户非常震撼。", f: "🇨🇳" },
  { t: "(北京/商務國旅) 靠谱！领导对这次的阿尔法专车很满意，司机不仅路熟，也很懂商务礼仪。", f: "🇨🇳" },
  { t: "(深圳/醫療中介) 日本干细胞治疗的资源你们确实是一手，价格和流程都很透明，以后医疗团就定你们家了。", f: "🇨🇳" },
  { t: "(廣州/高爾夫) 连打五天球，也是辛苦司机了，服务没得说，球场预订的时间段也很好。", f: "🇨🇳" },
  { t: "(成都/定制遊) 你们这个AI系统挺好用的，报价速度比我问其他日本地接快多了，这在抢单时很有优势。", f: "🇨🇳" },
  { t: "(杭州/企業遊學) 丰田TPS的课程安排很地道，翻译也是懂工业术语的，非常专业。", f: "🇨🇳" },
  { t: "(上海/醫美機構) 客户对银座那家诊所的隐私保护赞不绝口，这才是高端服务该有的样子。", f: "🇨🇳" },
  { t: "(北京/投資公司) 安排的大阪房地产考察很详尽，数据都很扎实，不是忽悠人的。", f: "🇨🇳" },
  { t: "(青島/旅行社) 樱花季的车真难找，多亏你们帮忙调度，不然团就炸了。", f: "🇨🇳" },
  { t: "(深圳/科技公司) 关西的行程设计得很有科技感，符合我们工程师团队的口味。", f: "🇨🇳" },
  { t: "(上海/MICE) 千人大会的分流做得井井有条，现场执行力很强。", f: "🇨🇳" },
  { t: "(大連/對日貿易) 帮忙联系的日本供应商很精准，直接促成了两单生意。", f: "🇨🇳" },
  { t: "(北京/高端公關) 这种低调奢华的风格很适合我们那些不爱张扬的VIP客户。", f: "🇨🇳" },
  { t: "(廈門/定制遊) 司机师傅很健谈，给客人介绍了很多当地风土人情，不仅是司机更是向导。", f: "🇨🇳" },
  { t: "(武漢/醫療健康) 癌症筛查的流程很人性化，体检报告翻译得也准确。", f: "🇨🇳" },
  { t: "(重慶/旅行社) 性价比高，同样的钱在你们这能享受到更好的车和餐。", f: "🇨🇳" },
  { t: "(蘇州/外企服務) 真的很省心，把需求发给你们，出来的方案基本不用大改。", f: "🇨🇳" },
  { t: "(上海/親子機構) 游学团的孩子们在京都体验了真正的茶道，家长反馈很好。", f: "🇨🇳" },
  { t: "(北京/私人管家) 以后日本的单子就交给新岛交通了，这种响应速度我喜欢。", f: "🇨🇳" },
  { t: "(深圳/電子煙企) 参观精密制造工厂的行程，让我们看到了差距，很有意义的考察。", f: "🇨🇳" },

  // 🇭🇰 香港 (91-95)
  { t: "(中環/高端旅遊) 效率好高，急单都能处理得咁好。客人对神户牛的安排非常满意，这才是真正的Premium Japan。", f: "🇭🇰" },
  { t: "(尖沙咀/Golf) Book场快手，Tee time靓。司机醒目，知道客人赶时间，路线行得好顺。", f: "🇭🇰" },
  { t: "(銅鑼灣/旅行社) 那个AI System好正，我地OP做报价悭番好多时间，正！", f: "🇭🇰" },
  { t: "(九龍/Family Office) 安排得好妥当，尤其是帮Boss订嘅米芝莲餐厅，很难Book都搞得掂。", f: "🇭🇰" },
  { t: "(香港/定制師) 无论是Shopping定系去睇楼，你地嘅安排都好Flexible，值得推荐。", f: "🇭🇰" },

  // 🇸🇬 新加坡 (96-100)
  { t: "(Singapore/Luxury) The English-speaking driver was excellent. Our clients were very impressed with the cleanliness of the Alphard.", f: "🇸🇬" },
  { t: "(Singapore/Golf) Efficient booking system. The itinerary for the Kansai golf tour was perfectly planned. No time wasted.", f: "🇸🇬" },
  { t: "(Singapore/Medical) Very professional handling of the medical check-up group. The translation service was accurate and discreet.", f: "🇸🇬" },
  { t: "(Singapore/Boutique) We appreciate the prompt reply even on weekends. The 'Omotenashi' service is real with Niijima Koutsu.", f: "🇸🇬" },
  { t: "(Singapore/Corporate) 合作很愉快，司机准时（Punctual），行程安排很灵活（Flexible），以后去Japan还是找你们。", f: "🇸🇬" },
];

// Parse raw text into structured data
const REVIEWS: Review[] = RAW_REVIEWS.map((r, i) => {
  const match = r.t.match(/^\((.*?)\)\s*(.*)/);
  const loc = match ? match[1] : "Partner";
  const text = match ? match[2] : r.t;
  const tag = loc.split('/')[1] || loc;

  return { id: i, loc, flag: r.f, text, tag };
});

const chunkArray = (array: Review[], numChunks: number) => {
  const chunkSize = Math.ceil(array.length / numChunks);
  const chunks: Review[][] = [];
  for (let i = 0; i < numChunks; i++) {
    chunks.push(array.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  return chunks;
};

// --- Components ---

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm min-w-[320px] max-w-[320px] flex-shrink-0 mx-3 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{review.flag}</span>
        <div>
            <p className="text-xs font-bold text-neutral-800">{review.loc}</p>
            <div className="flex text-gold-400 gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
            </div>
        </div>
    </div>
    <div className="relative">
        <Quote size={16} className="absolute -top-1 -left-1 text-neutral-200 transform -scale-x-100" />
        <p className="text-sm text-neutral-600 leading-relaxed pl-2 relative z-10 line-clamp-3">
            {review.text}
        </p>
    </div>
  </div>
);

const MarqueeRow = ({ reviews, direction = 'left', duration = '60s' }: { reviews: Review[], direction?: 'left' | 'right', duration?: string }) => {
  return (
    <div className="relative flex overflow-hidden w-full group">
      <div 
        className={`flex animate-marquee-${direction} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: duration }}
      >
        {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        {/* Duplicate for seamless loop */}
        {reviews.map((r) => <ReviewCard key={`dup-${r.id}`} review={r} />)}
      </div>
    </div>
  );
};

const TestimonialWall: React.FC = () => {
  // Split into 3 rows for horizontal flow
  const rows = chunkArray(REVIEWS, 3);

  return (
    <div className="w-full bg-neutral-50 py-20 border-y border-neutral-200 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-12 text-center">
         <span className="text-brand-700 font-bold tracking-widest text-xs uppercase bg-brand-50 px-3 py-1 rounded-full">Voice of Partners</span>
         <h2 className="text-3xl font-serif text-neutral-900 mt-4">100+ 旅行社のリアルな評価</h2>
         <p className="text-neutral-500 text-sm mt-2">台湾・中国・香港・シンガポールのプロフェッショナルたちから選ばれています</p>
      </div>

      <div className="flex flex-col gap-8">
         <style>{`
            @keyframes marquee-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            @keyframes marquee-right {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0); }
            }
            .animate-marquee-left { animation: marquee-left linear infinite; }
            .animate-marquee-right { animation: marquee-right linear infinite; }
         `}</style>

         {/* Row 1: Left */}
         <MarqueeRow reviews={rows[0]} direction="left" duration="80s" />
         
         {/* Row 2: Right */}
         <MarqueeRow reviews={rows[1]} direction="right" duration="90s" />
         
         {/* Row 3: Left */}
         <MarqueeRow reviews={rows[2]} direction="left" duration="100s" />
      </div>
      
      {/* Gradients for fade effect */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default TestimonialWall;
