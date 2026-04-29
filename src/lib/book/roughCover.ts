import type { Attachment } from 'svelte/attachments';
import rough from 'roughjs';
import { coverDoodles } from './coverDoodles';

const append = (svg: SVGSVGElement, node: SVGElement) => {
  svg.appendChild(node);
};

const drawSparkles = (svg: SVGSVGElement, rc: ReturnType<typeof rough.svg>) => {
  const points = [
    [52, 54],
    [246, 62],
    [58, 328],
    [248, 318]
  ];

  points.forEach(([x, y], index) => {
    const length = index % 2 === 0 ? 14 : 10;
    append(svg, rc.line(x - length, y, x + length, y, { stroke: '#f39c6b', strokeWidth: 1.4 }));
    append(svg, rc.line(x, y - length, x, y + length, { stroke: '#f39c6b', strokeWidth: 1.4 }));
  });
};

const drawTeacherApple = (svg: SVGSVGElement, rc: ReturnType<typeof rough.svg>) => {
  append(svg, rc.circle(64, 274, 42, { fill: '#f47b7b', fillStyle: 'solid', stroke: '#27211d' }));
  append(svg, rc.path('M63 252 C64 238, 76 239, 76 228', { stroke: '#27211d', strokeWidth: 2 }));
  append(svg, rc.ellipse(84, 241, 26, 13, { fill: '#9acb72', fillStyle: 'hachure', stroke: '#27211d' }));
  append(svg, rc.path('M56 274 C61 281, 69 281, 75 274', { stroke: '#27211d', strokeWidth: 1.4 }));
};

const drawBirthdayCake = (svg: SVGSVGElement, rc: ReturnType<typeof rough.svg>) => {
  append(svg, rc.rectangle(194, 260, 58, 44, { fill: '#ffd0dc', fillStyle: 'zigzag', stroke: '#27211d' }));
  append(svg, rc.rectangle(186, 250, 74, 16, { fill: '#fff3a4', fillStyle: 'solid', stroke: '#27211d' }));
  append(svg, rc.line(209, 250, 209, 230, { stroke: '#27211d', strokeWidth: 1.5 }));
  append(svg, rc.line(236, 250, 236, 230, { stroke: '#27211d', strokeWidth: 1.5 }));
  append(svg, rc.path('M204 227 C209 218, 214 226, 209 231', { fill: '#f39c6b', fillStyle: 'solid', stroke: '#27211d' }));
  append(svg, rc.path('M231 227 C236 218, 241 226, 236 231', { fill: '#f39c6b', fillStyle: 'solid', stroke: '#27211d' }));
};

const drawPencil = (svg: SVGSVGElement, rc: ReturnType<typeof rough.svg>) => {
  append(
    svg,
    rc.polygon(
      [
          [42, 102],
          [54, 91],
          [106, 143],
          [94, 155]
      ],
      { fill: '#ffd66b', fillStyle: 'solid', stroke: '#27211d' }
    )
  );
  append(
    svg,
    rc.polygon(
      [
          [94, 155],
          [106, 143],
          [116, 166]
      ],
      { fill: '#f5e1c8', fillStyle: 'hachure', stroke: '#27211d' }
    )
  );
  append(svg, rc.line(61, 98, 49, 110, { stroke: '#f47b7b', strokeWidth: 5 }));
};

const drawCover = (svg: SVGSVGElement) => {
  svg.replaceChildren();

  const rc = rough.svg(svg, {
    options: {
      roughness: 1.8,
      bowing: 1.3,
      stroke: '#27211d',
      strokeWidth: 1.6,
      seed: 11
    }
  });

  append(svg, rc.rectangle(18, 18, 264, 364, { fill: '#fff8dc', fillStyle: 'solid', strokeWidth: 2.2 }));
  append(svg, rc.rectangle(32, 45, 236, 310, { fill: '#fffef5', fillStyle: 'hachure', hachureGap: 12 }));
  append(svg, rc.line(48, 136, 252, 136, { stroke: '#f0b0a7', strokeWidth: 1.1 }));
  append(svg, rc.line(48, 178, 252, 178, { stroke: '#f0b0a7', strokeWidth: 1.1 }));
  append(svg, rc.line(48, 322, 252, 322, { stroke: '#f0b0a7', strokeWidth: 1.1 }));

  coverDoodles.forEach((doodle) => {
    if (doodle.id === 'sparkles') drawSparkles(svg, rc);
    if (doodle.id === 'teacher-apple') drawTeacherApple(svg, rc);
    if (doodle.id === 'birthday-cake') drawBirthdayCake(svg, rc);
    if (doodle.id === 'pencil') drawPencil(svg, rc);
  });
};

export const coverDoodleDrawing: Attachment<SVGSVGElement> = (svg) => {
  drawCover(svg);

  return () => {
    svg.replaceChildren();
  };
};
