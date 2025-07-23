import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function BarChart({ datos }) {
  const ref = useRef();

  useEffect(() => {
    if (!datos.length) return;
    const data = d3.rollups(
      datos,
      v => d3.sum(v, d => d.valor_usd || 0),
      d => d.região
    ).map(([region, total]) => ({ region, total }));

    const width = 400, height = 300, margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const x = d3.scaleBand().domain(data.map(d => d.region)).range([margin.left, width - margin.right]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.total)]).nice().range([height - margin.bottom, margin.top]);

    svg.append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.region))
      .attr('y', d => y(d.total))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d.total))
      .attr('fill', '#1976d2');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [datos]);

  return (
    <div>
      <h4>Total por región (USD)</h4>
      <svg ref={ref}></svg>
    </div>
  );
} 