import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function PieChart({ datos }) {
  const ref = useRef();

  useEffect(() => {
    if (!datos.length) return;
    const data = d3.rollups(
      datos,
      v => d3.sum(v, d => d.valor_usd || 0),
      d => d.sector
    ).map(([sector, total]) => ({ sector, total }));

    const width = 300, height = 300, radius = Math.min(width, height) / 2;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.total);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    g.selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.sector))
      .attr('stroke', '#fff');

    g.selectAll('text')
      .data(pie(data))
      .join('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', 12)
      .text(d => d.data.sector);
  }, [datos]);

  return (
    <div>
      <h4>Total por sector (USD)</h4>
      <svg ref={ref}></svg>
    </div>
  );
} 