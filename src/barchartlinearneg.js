import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

import styled from "styled-components"
import "./barchart.css"

const BarChartLinearNeg = (props) => {
    const canvas = useRef(null)

    useEffect(() => {
        const vdata = props.vertical
        const hdata = props.horizontal
        const margin = props.margin
        const width = props.width
        const height = props.height
        const fillColor = props.barColor
        const borderColor = props.barBorder
        const htext = props.horizontalText
        const vtext = props.verticalText
        const title = props.title
        const tooltip = props.tooltip
        vdata.length && drawBarChart(vdata, hdata, margin, width, height, fillColor, borderColor, htext, vtext, title, tooltip)
    }, [props])

    const chartcanvas = props.canvas
    const VizWrapper = styled.div`
        width: ${chartcanvas.width};
        height: ${chartcanvas.height};
        margin: auto;
        text-align: center;
        background-color: ${chartcanvas.background};
        border-style: ${chartcanvas.border.style};
        border-width: ${chartcanvas.border.width};
        border-color: ${chartcanvas.border.color};
        border-radius: ${chartcanvas.border.radius};
        padding: 5% 5% 5% 5%;
    `
    const chartColor = props.chartBackground
    const BarCanvas = styled.div`
        background-color: ${chartColor};
        margin: auto;
    `

    const drawBarChart = (vdata, hdata, margin, width, height, fillColor, borderColor, htext, vtext, title, tooltip) => {

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

        
        const xscale = d3.scaleLinear()
        .domain([d3.min(hdata), d3.max(hdata)])
        .range([0, width]);
            

        const xAxis = d3.axisBottom(xscale).tickFormat(d3.format("d"))

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
            .domain([0, d3.max(vdata)])
            .range([0, height]);

        const scaledVals = vdata.map(function (item) {
            return linearScale(item);
        });
        const negVals = vdata.filter(val => {
            return val < 0
        })
        console.log("neg vals")
        console.log(negVals)
        const absvals = negVals.map(val => {
            return Math.abs(val)
        })
        console.log(absvals)
        console.log(d3.max(absvals)*-1)

        
        const yscale = d3.scaleLinear()
            .domain([d3.max(absvals)*-1, d3.max(vdata)])
            .range([height - (linearScale(d3.max(absvals)*-1)), 0]);

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
            .attr('width', width/hdata.length)
            .attr('height', function (d) {
                return Math.abs(d);
            })
            .attr("stroke", borderColor)
            .attr('fill', fillColor)
            .attr('x', function (d, i) {
                return xscale(hdata[i]) + margin.left;
            })
            .attr('y', function (d, i) {
                if (d < 0) {
                    return height + bartop
                } else {
                    return height - d + bartop  
                }
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
        <VizWrapper>
            <BarCanvas ref={canvas}></BarCanvas>
        </VizWrapper>
    )
}

export default BarChartLinearNeg