import { LogOut, Pause, Play, RotateCcw, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button, Modal } from '../../design-system';

/**
 * Pause overlay — matches image-assets/Lunar Base Mission Paused.png. "Settings" opens a
 * second view with the destructive actions, each needing a second tap to confirm.
 * The game screen (Phase 6) supplies the handlers.
 */
interface Props {
  onResume: () => void;
  onExit: () => void;
  onRestart: () => void;
  onResetProgress: () => void;
}

const row = 'w-full !rounded-full !justify-start gap-4 !px-8 !py-3 !text-xl !normal-case';
const icon = 'size-7 shrink-0';

export function PauseMenu({ onResume, onExit, onRestart, onResetProgress }: Props) {
  const [view, setView] = useState<'pause' | 'settings'>('pause');
  const [confirming, setConfirming] = useState<null | 'restart' | 'reset'>(null);

  if (view === 'settings') {
    return (
      <Modal title="Settings" icon={Settings} onClose={() => setView('pause')}>
        <div className="flex flex-col gap-4">
          {confirming ? (
            <>
              <p className="text-center text-xl text-blue-100">
                {confirming === 'restart' ? 'Restart this mission from Day 1?' : 'Erase all stars and progress?'}
              </p>
              <Button variant="primary" size="md" className={row} onClick={confirming === 'restart' ? onRestart : onResetProgress}>
                Yes, {confirming === 'restart' ? 'restart' : 'erase'}
              </Button>
              <Button variant="ghost" size="md" className={row} onClick={() => setConfirming(null)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="md" className={row} icon={<RotateCcw aria-hidden className={icon} />} onClick={() => setConfirming('restart')}>
                Restart Mission
              </Button>
              <Button variant="primary" size="md" className={row} icon={<Trash2 aria-hidden className={icon} />} onClick={() => setConfirming('reset')}>
                Reset All Progress
              </Button>
              <Button variant="ghost" size="md" className={row} onClick={() => setView('pause')}>
                Back
              </Button>
            </>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Game Paused" icon={Pause} onClose={onResume}>
      <div className="flex flex-col gap-4">
        <Button variant="primary" size="md" className={row} icon={<Play aria-hidden className={`${icon} fill-current`} />} onClick={onResume}>
          Resume Mission
        </Button>
        <Button variant="primary" size="md" className={row} icon={<Settings aria-hidden className={icon} />} onClick={() => setView('settings')}>
          Settings
        </Button>
        <Button variant="primary" size="md" className={row} icon={<LogOut aria-hidden className={icon} />} onClick={onExit}>
          Return to Mission Menu
        </Button>
      </div>
    </Modal>
  );
}
