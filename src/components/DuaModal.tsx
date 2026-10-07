import React, { useState } from 'react';
import { X, Copy, Check, BookOpen, Volume2 } from 'lucide-react';

interface DuaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DuaItem {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

const DUAS_LIST: DuaItem[] = [
  {
    id: 'after-adhan',
    category: 'Adhan & Call to Prayer',
    title: 'Supplication After the Adhan',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ.',
    transliteration: "Allahumma Rabba hadhihid-da'wati-t-tammah, was-salatil-qa'imah, ati Muhammadan al-wasilata wal-fadilah, wab'ath-hu maqamam mahmudanilladhi wa'adtah.",
    translation: 'O Allah, Owner of this perfect call and Owner of this prayer to be performed, grant Muhammad the station of Wasilah and high honor, and resurrect him to the praised station which You have promised him.',
    reference: 'Sahih al-Bukhari 614',
  },
  {
    id: 'qunut-subuh',
    category: 'Zuboh / Subuh Prayer',
    title: 'Du\'a Qunut in Zuboh / Subuh',
    arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَىٰ عَلَيْكَ.',
    transliteration: 'Allahummahdini fi man hadayt, wa \'afini fi man \'afayt, wa tawallani fi man tawallayt, wa barik li fi ma a\'tayt, wa qini sharra ma qadayt, fa innaka taqdi wa la yuqda \'alayk.',
    translation: 'O Allah, guide me among those You have guided, pardon me among those You have pardoned, befriend me among those You have befriended, bless me in what You have bestowed, and save me from the evil of what You have decreed.',
    reference: 'Sunan Abu Dawud 1425',
  },
  {
    id: 'after-salam',
    category: 'After Prayer (Post-Salat)',
    title: 'Supplication After Finishing Prayer',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.',
    transliteration: "Astaghfirullah, Astaghfirullah, Astaghfirullah. Allahumma Antas-Salamu wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.",
    translation: 'I ask Allah for forgiveness (three times). O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of majesty and honor.',
    reference: 'Sahih Muslim 591',
  },
  {
    id: 'ayatul-kursi',
    category: 'After Prayer',
    title: 'Ayat al-Kursi (The Throne Verse)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ.',
    transliteration: "Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard...",
    translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...',
    reference: 'Surah Al-Baqarah 2:255',
  },
  {
    id: 'sayyidul-istighfar',
    category: 'Morning & Evening',
    title: 'Master Supplication of Forgiveness',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.',
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika ma stata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa Ant.",
    translation: 'O Allah, You are my Lord, there is no deity worthy of worship except You. You created me and I am Your servant, and I abide by Your covenant and promise as much as I am able...',
    reference: 'Sahih al-Bukhari 6306',
  },
];

export const DuaModal: React.FC<DuaModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (dua: DuaItem) => {
    const textToCopy = `${dua.title}\n\n${dua.arabic}\n\nTransliteration: ${dua.transliteration}\n\nTranslation: ${dua.translation}\n\n(${dua.reference})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Essential Du'as & Supplications</h2>
              <p className="text-xs text-slate-400">Supplications for Adhan and Daily Prayers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Du'a List */}
        <div className="space-y-4">
          {DUAS_LIST.map((dua) => {
            const isCopied = copiedId === dua.id;
            return (
              <div
                key={dua.id}
                className="rounded-2xl bg-slate-950/60 border border-slate-800/90 p-5 space-y-3.5 hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {dua.category}
                    </span>
                    <h3 className="text-base font-bold text-white">{dua.title}</h3>
                  </div>
                  <button
                    onClick={() => handleCopy(dua)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-850 border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy Du'a to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Arabic Calligraphy */}
                <div className="font-amiri text-2xl sm:text-3xl text-emerald-200 leading-loose text-right dir-rtl py-1 bg-slate-900/40 p-4 rounded-xl border border-slate-850/60">
                  {dua.arabic}
                </div>

                {/* Transliteration */}
                <div className="text-xs sm:text-sm text-slate-300 italic font-sans leading-relaxed">
                  "{dua.transliteration}"
                </div>

                {/* Meaning */}
                <div className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-300">Meaning: </span>
                  {dua.translation}
                </div>

                {/* Reference */}
                <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-900">
                  Ref: {dua.reference}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
