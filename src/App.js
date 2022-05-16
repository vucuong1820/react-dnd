import "@atlaskit/css-reset";
import initialData from "./data/initialData";
import { useState } from "react";
import Column from "./components/Column";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;
function App() {
  const [data, setData] = useState(initialData);
  const onDragEnd = (result) => {
    // document.body.style.fontWeight = 'inherit';
    // document.body.style.color = 'inherit';
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start.id === finish.id) {
      const newTaskIds = [...start.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [start.id]: newColumn,
        },
      }));
      return;
    }

    // moving from a column to another different column
    const startTaskIds = [...start.taskIds];
    startTaskIds.splice(source.index, 1)
    const newStartColumn = {
      ...start,
      taskIds: startTaskIds
    }
    const finishTaskIds = [...finish.taskIds]
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinishColumn = {
      ...finish,
      taskIds: finishTaskIds
    }
    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [start.id]: newStartColumn,
        [finish.id]: newFinishColumn
      },
    }));

  };
  // const onDragStart = (result) => {
  //   document.body.style.fontWeight = '700';
  //   document.body.style.transition = 'all 0.2s ease';
  // }
  // const onDragUpdate = (result) => {
  //   const { destination } = result;
  //   const opacity = destination ? destination.index / Object.keys(data.tasks).length : 0;
  //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  // }
  return (
    <DragDropContext
      // onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      // onDragUpdate={onDragUpdate}
    >
      <Container>
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </Container>
    </DragDropContext>
  );
}

export default App;
