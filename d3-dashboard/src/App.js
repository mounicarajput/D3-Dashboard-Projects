import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './App.css';

const App = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/data')
      .then(response => response.json())
      .then(data => {
        data = data.map(d => ({
          intensity: d.intensity,
          relevance: d.relevance,
          sector: d.sector,
          likelihood: d.likelihood,
        }));

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(d3Container.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
          .domain(data.map(d => d.sector))
          .range([0, width])
          .padding(0.1);

        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => d.intensity)])
          .nice()
          .range([height, 0]);

        svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x));

        svg.append('g')
          .call(d3.axisLeft(y));

        svg.selectAll('.bar')
          .data(data)
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.sector))
          .attr('y', d => y(d.intensity))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d.intensity))
          .attr('fill', 'steelblue');
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="App">
      <h1>Data Visualization Dashboard</h1>
      <svg ref={d3Container}></svg>
    </div>
  );
};

export default App;
