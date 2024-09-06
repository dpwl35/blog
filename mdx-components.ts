import { A as a } from '@/components/a';
import { P as p } from '@/components/p';
import { H1 as h1 } from '@/components/h1';

export function useMDXComponents(components: { [component: string]: React.ComponentType }) {
  return {
    ...components,
    a,
    h1,
    p,
  };
}
