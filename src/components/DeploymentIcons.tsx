import type { DeploymentTarget } from '../types/registry'

const ICONS: Record<DeploymentTarget, { icon: string; label: string; color: string }> = {
  'local-only':       { icon: '💻', label: 'Local only',        color: 'text-gray-400' },
  'local-desktop':    { icon: '🖥',  label: 'Desktop app',       color: 'text-blue-400' },
  'local-cli':        { icon: '⌨',  label: 'CLI',               color: 'text-gray-400' },
  'cloudflare-pages': { icon: '☁',  label: 'Cloudflare Pages',  color: 'text-orange-400' },
  'cloudflare-tunnel':{ icon: '🔗', label: 'Cloudflare Tunnel', color: 'text-orange-400' },
  'netlify':          { icon: '▲',  label: 'Netlify',            color: 'text-teal-400' },
  'railway':          { icon: '🚄', label: 'Railway',            color: 'text-purple-400' },
  'raspberry-pi':     { icon: '🫐', label: 'Raspberry Pi',       color: 'text-red-400' },
  'github-pages':     { icon: '🐙', label: 'GitHub Pages',       color: 'text-white' },
  'android-termux':   { icon: '📱', label: 'Android/Termux',     color: 'text-green-400' },
  'nsis-installer':   { icon: '📦', label: 'NSIS Installer',     color: 'text-amber-400' },
  'esp32-firmware':   { icon: '🔌', label: 'ESP32 Firmware',     color: 'text-cyan-400' },
}

const UNKNOWN = { icon: '❓', label: 'Unknown target', color: 'text-gray-500' }

interface Props {
  targets: DeploymentTarget[]
}

export function DeploymentIcons({ targets }: Props) {
  if (!targets.length) return null
  return (
    <div className="flex items-center gap-1">
      {targets.map(t => {
        const cfg = ICONS[t] ?? UNKNOWN
        return (
          <span
            key={t}
            title={cfg.label}
            className={`text-sm leading-none ${cfg.color}`}
          >
            {cfg.icon}
          </span>
        )
      })}
    </div>
  )
}
