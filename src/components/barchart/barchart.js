import React, { useEffect, useRef } from "react"
import * as d3 from "d3"

import "./barchart.css"

import styled from "styled-components"



const BarChart = (props) => {

    const canvas = useRef(null)

    useEffect(() => {
        console.log(props)
        const vdata = props.vertical
        const hdata = props.horizontal
        const margin = props.margin
        const width = props.width
        const height = props.height
        const fillColor = props.barColor
        const htext = props.horizontalText
        const vtext = props.verticalText
        const title = props.title
        const tooltip = props.tooltip
        vdata.length && drawBarChart(vdata, hdata, margin, width, height, fillColor, htext, vtext, title, tooltip)
    }, [props])

    const chartcanvas = props.canvas
    const VizWrapper = styled.div`
    width: ${chartcanvas.width};
    height: ${chartcanvas.height};
    margin: auto;
    text-align: center;
    background-color: ${chartcanvas.color};
    color: white;
    border-style: solid;
    border-width: 5px;
    border-color: white;
    border-radius: 10px;
    box-shadow: inset 1px 1px 5px;
    padding: 5% 5% 0% 5%;
`
const BarCanvas = styled.div`
    margin-top: 0px;
    background-color: ${chartcanvas.color};
`

    const drawBarChart = (vdata, hdata, margin, width, height, fillColor, htext, vtext, title, tooltip) => {

        d3.select("svg").remove()

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

        
        // const xscale = d3.scaleLinear()
        //     .domain([d3.min(hdata), d3.max(hdata)])
        //     .range([0, width]);
        const xscale = d3.scaleBand()
            .domain(hdata)
            .range([0, width])
            .padding([.1])
            

        const xAxis = d3.axisBottom(xscale);

        const bartop = margin.top/2 + 5
        const barbase = height + bartop
        svg.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(' + margin.left + ',' + barbase + ')');
        
        svg.append('text')
            .attr("x", width/2.5)
            .attr("y", height + 1.25*margin.top)
            .attr("fill", htext.color)
            .text(htext.text)
            
        const linearScale = d3.scaleLinear()
            .domain([0, d3.max(vdata)])
            .range([0, height]);

        const scaledVals = vdata.map(function (item) {
            return linearScale(item);
        });

        const yscale = d3.scaleLinear()
            .domain([0, d3.max(vdata)])
            .range([height, 0]);

        const yAxis = d3.axisLeft(yscale)

        
        svg.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + margin.left + ',' + bartop + ')');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -230)
            .attr('y', 15)
            .attr("fill", vtext.color)
            .text(vtext.text)
        
        svg.append("text")
            .attr("x", 110)
            .attr("y", 15)
            .attr("class", "graph-title")
            .attr("fill", "white")
        svg.append("text")
            .attr("x", width/2)
            .attr("y", margin.top/4)
            .attr("class", "graph-subtitle")
            .attr("fill", title.color)
            .text(title.text)

        svg.selectAll('rect')
            .data(scaledVals)
            .enter()
            .append('rect')
            .attr('width', xscale.bandwidth())
            .attr('height', function (d) {
                return d;
            })
            .attr('fill', fillColor)
            .attr('x', function (d, i) {
                return xscale(hdata[i]) + margin.left;
            })
            .attr('y', function (d, i) {
                return height - d + bartop;
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
                .style('left', (d3.event.pageX - 18) + 'px')
                .style('top', (d3.event.pageY - 44) + 'px')
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

export default BarChart