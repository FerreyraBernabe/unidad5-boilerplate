import {
  HeartPulse,
  Lightbulb,
  FlaskConical,
  Smile,
  Stethoscope,
  Eye,
  Bone,
  Brain,
  Activity,
  Baby,
  Syringe,
} from 'lucide-react';

const normalizeText = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const ICON_MAP = {
  cardiologia: HeartPulse,
  neurologia: Lightbulb,
  dermatologia: FlaskConical,
  pediatria: Smile,
  oftalmologia: Eye,
  traumatologia: Bone,
  psiquiatria: Brain,
  ginecologia: Baby,
  endocrinologia: Activity,
  oncologia: Syringe,
};

function SpecialtyIcon({ name, className = 'w-5 h-5' }) {
  const normalized = normalizeText(name);
  const Icon = ICON_MAP[normalized] || Stethoscope;

  return <Icon className={className} strokeWidth={1.8} />;
}

export default SpecialtyIcon;
