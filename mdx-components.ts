import { A as a } from '@/app/components/a';
import { P as p } from '@/app/components/p';
import { H1 as h1 } from '@/app/components/h1';
import { H2 as h2 } from '@/app/components/h2';
import { H3 as h3 } from '@/app/components/h3';

export function useMDXComponents(components: { [component: string]: React.ComponentType }) {
  return {
    ...components,
    a,
    h1,
    h2,
    h3,
    p,
  };
}
