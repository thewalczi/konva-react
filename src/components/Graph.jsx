import React, { useEffect, useRef, useState } from 'react'
import {Arrow, Group, Layer, Rect, Stage, Text} from 'react-konva'

const data = [
  {id: 1, name: 'This is node 1', connections: [{id: 3}]},
  {id: 2, name: 'This is node 2, which is a second node', connections: [{id: 1}, {id: 3}]},
  {id: 3, name: 'This is node 1'}
]

const NODE_WIDTH = 200
const NODE_HEIGHT = 100

export default () => {

  const stageRef = useRef(null)

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  useEffect(() => {
    const nodesData = data.map((node, i) => ({
      ...node,
      x: 150 * i,
      y: 150 * i,
      isDragging: false
    })
    )
    setNodes(nodesData)
  }, [])

  useEffect(() => {
    if (edges.length) {
      return
    }
    const edgesData = nodes.reduce((acc, curr, i, arr) =>{
      if(curr.hasOwnProperty('connections')) {
        curr.connections.forEach(item => {
          const target = arr.find(node => node.id === item.id)
          return acc.push({
            source: curr.id,
            sourceX: curr.x,
            sourceY: curr.y,
            target: target.id,
            targetX: target.x,
            targetY: target.y 
          })
        })
      }
      return acc
    }, [])
    setEdges(edgesData)
  }, [nodes])


  const handleDragStart = (e) => {
    const id = e.target.id
    setNodes(nodes.map(node => ({...node, isDragging: node.id === id})))
  }

  const handleDragMove = (e) => {
    const activeNode = e.target.attrs
    const id = parseInt(activeNode.id)
  
    setEdges(edges.map(edge => {
      if(edge.source === id) {
        return {...edge, sourceX: activeNode.x, sourceY: activeNode.y}
      } else if (edge.target === id) {
        return {...edge, targetX: activeNode.x, targetY: activeNode.y}
      } else {
        return edge
      }
    }))
  }
  
  // useEffect(() => console.log(edges), [edges])

  const handleZoomStage = (event) => {
    e.preventDefault()
    // if (stageRef.current !== null) {
    //   const stage = stageRef.current
    //   const oldScael = stage.scaleX
    //   const {x: pointerX, y: pointerY} = stage.getPointerPosition()
    //   const mousePointTo = {
    //     x: (pointerX - stage.x())
    //   }
    // }
    alert('wheewhewheel')

  }
  
  
  const handleDragEnd = (e) => {
    setNodes(nodes.map(node => ({...node, isDragging: false})))
    // setEdges(drawEdges)
  }
  return (
	<Stage
    width={window.innerWidth} 
    height={window.innerHeight} 
    draggable 
    onWheel={handleZoomStage}
    ref={stageRef}
  >
    <Layer>
      {edges && edges.map(edge => 
        <Arrow
          key={`${edge.target}-${edge.source}`}
          points={[edge.sourceX, edge.sourceY + (NODE_HEIGHT / 2), edge.targetX + NODE_WIDTH, edge.targetY + NODE_HEIGHT / 2]}
          fill='blue'
        stroke='green'
        dash={[5, 5]}
        strokeWidth={2}
        onDragMove={handleDragMove}
        />
      )}
      {nodes.map(node => 
      <Group
        key={node.id}
        id={`${node.id}`}
        x={node.x}
        y={node.y}
        draggable
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        width={NODE_WIDTH}
          height={NODE_HEIGHT}
      >
        <Rect
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          // x={0}
          // y={0}
          fill="white"
          stroke="lightblue"
          />
          <Text
            x={10}
            y={10}
            width={NODE_WIDTH - 20}
            height={NODE_HEIGHT - 20}
            text={node.name}
          />
      </Group>
      )}
    </Layer>
  </Stage>
  )
}
