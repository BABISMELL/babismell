import { useGlobalStore } from '@/stores/globalStore';
import { CountdownTimer } from './CountdownTimer';

export function CountdownBanner() {
  const countdown = useGlobalStore(state => state.countdown);

  if (!countdown.isEnabled) {
    return null;
  }

  return (
    <div className="bg-purple-600 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold mb-2">{countdown.title}</h2>
          <p className="text-sm mb-4">{countdown.description}</p>
          <CountdownTimer endDate={countdown.endDate} isActive={countdown.isEnabled} />
        </div>
      </div>
    </div>
  );
}