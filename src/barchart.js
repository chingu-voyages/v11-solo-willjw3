import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

import styled from "styled-components"
import "./barchart.css"

const BarChart = (props) => {
    const canvas = useRef(null)

    useEffect(() => {
        const vdata = props.vertical
        const hdata = props.horizontal
        const minVal = props.setMin[0] === true ? props.setMin[1] : d3.min(vdata)
        const margin = props.margin
        const width = props.width
        const height = props.height
        const fillColor = props.barColor
        const borderColor = props.barBorder
        const htext = props.horizontalText
        const vtext = props.verticalText
        const title = props.title
        const tooltip = props.tooltip
        vdata.length && drawBarChart(vdata, hdata, minVal, margin, width, height, fillColor, borderColor, htext, vtext, title, tooltip)
    }, [props])

    const chartColor = props.chartBackground
    const BarCanvas = styled.div`
        background-color: ${chartColor};
        margin: auto;
    `

    const drawBarChart = (vdata, hdata, minVal, margin, width, height, fillColor, borderColor, htext, vtext, title, tooltip) => {

        var div = d3.select(canvas.current).append("div")
            .attr("id", "tooltip")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const svg = d3.select(canvas.current)
            .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
            .attr('preserveAspectRatio', 'xMinYMin')

        
        const paddingBetween = props.spaceBetween
        const xscale = d3.scaleBand()
            .domain(hdata)
            .range([0, width])
            .padding([paddingBetween])
            

        const xAxis = d3.axisBottom(xscale);

        const bartop = margin.top/2 + 5
        const barbase = height + bartop
        svg.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(' + margin.left + ',' + barbase + ')')
        
        svg.append('text')
            .attr("x", htext.fromLeft)
            .attr("y", height + margin.top + htext.space)
            .attr("fill", htext.color)
            .text(htext.text)
            
        const linearScale = d3.scaleLinear()
            .domain([minVal, d3.max(vdata)])
            .range([0, height]);

        const scaledVals = vdata.map(function (item) {
            return linearScale(item);
        });

        const yscale = d3.scaleLinear()
            .domain([minVal, d3.max(vdata)])
            .range([height, 0]);

        const yAxis = d3.axisLeft(yscale)

        
        svg.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + margin.left + ',' + bartop + ')')

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', vtext.fromTop)
            .attr('y', vtext.space)
            .attr("fill", vtext.color)
            .text(vtext.text)
        
        svg.append("text")
            .attr("x", title.fromLeft)
            .attr("y", margin.top/3)
            .attr("class", "graph-subtitle")
            .attr("fill", title.color)
            .text(title.text)

        svg.selectAll('rect')
            .data(scaledVals)
            .enter()
            .append('rect')
            .attr('width', xscale.bandwidth())
            .attr('height', function (d) {
                return d
            })
            .attr("stroke", borderColor)
            .attr('fill', fillColor)
            .attr('x', function (d, i) {
                return xscale(hdata[i]) + margin.left;
            })
            .attr('y', function (d, i) {
                return height - d + bartop
            })
            .on("mouseover", (d, i) => {
                div.transition()
                .duration(200)
                .style("width", tooltip.width)
                .style("height", tooltip.height)
                .style("opacity", tooltip.opacity)
                .style("color", tooltip.color)
                .style("background", tooltip.background)
                div.html(tooltip.x + ": " + hdata[i] + "<br>" + tooltip.y + ": " + vdata[i])
                .style('left', (d3.event.pageX - tooltip.xshift) + 'px')
                .style('top', (d3.event.pageY - tooltip.yshift) + 'px')
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            });
    }

    return (
        <>
            <BarCanvas ref={canvas}></BarCanvas>
        </>
    )
}

export default BarChart