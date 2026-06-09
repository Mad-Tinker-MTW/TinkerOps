export type Status =
  | 'active'
  | 'dormant'
  | 'placeholder'
  | 'pre-build'
  | 'complete'
  | 'archived'
  | 'triage'

export type Division =
  | 'Foundry'
  | 'GemLab'
  | 'TimeWorks'
  | 'Games'
  | 'WebDivision'
  | 'Tools'
  | 'Docs'
  | null

export type PackageManager = 'bun' | 'pnpm' | 'npm' | 'uv' | 'cargo' | 'scoop' | null

export type DeploymentTarget =
  | 'local-only'
  | 'local-desktop'
  | 'local-cli'
  | 'cloudflare-pages'
  | 'cloudflare-tunnel'
  | 'netlify'
  | 'railway'
  | 'raspberry-pi'
  | 'github-pages'
  | 'android-termux'
  | 'nsis-installer'

export interface Docs {
  readme: boolean
  claude_md: boolean
  status_md: boolean
  pmp: boolean
  handoff_md: boolean
  design_md: boolean
  obsidian_note: boolean
}

export interface URLs {
  production: string | null
  staging: string | null
  local: string | null
}

export interface Project {
  id: string
  name: string
  status: Status
  division: Division
  path: string
  alt_path: string | null
  stack: string[]
  package_manager: PackageManager
  deployment: DeploymentTarget[]
  urls: URLs
  github: string | null
  docs: Docs
  pmp_ids: string | null
  launch: string | null
  launch_cmd: string | null
  port: number | null
  last_worked: string | null
  last_commit: string | null
  summary: string
  tags: string[]
  blocked_by: string | null
  triage_needed: boolean
  /**
   * True if this is UAT coursework, grouped under the dashboard UAT toggle
   * (default on). Toggling it off in TinkerOps marks the project "to be moved"
   * (that flip is persisted client-side in localStorage, since the dashboard
   * has no backend to write registry.json).
   */
  uat?: boolean
  notes: string | null
}

export interface RegistryMeta {
  version: string
  generated: string
  generated_by: string
  total: number
  active: number
  dormant: number
  pre_build: number
  placeholder: number
  complete: number
  archived: number
  triage: number
}

export interface Registry {
  _meta: RegistryMeta
  projects: Project[]
}

// Pipeline state is written by the TinkerPipeline runner to a separate
// pipeline-state.json (keyed by project id), read here alongside the registry.
export type PipelinePhase = 'idle' | 'plan' | 'execute' | 'awaiting-audit' | 'audit'
export type PipelineStatus = 'ok' | 'running' | 'failed'

export interface PipelineState {
  phase: PipelinePhase
  status: PipelineStatus
  last_run: string
  plan_file?: string | null
  tasks_total?: number
  tasks_complete?: number
  tasks_failed?: number
  tasks_skipped?: number
  last_task?: string | null
  last_commit?: string | null
  runner_version?: string | null
}

export type PipelineStateMap = Record<string, PipelineState>
