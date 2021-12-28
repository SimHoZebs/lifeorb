import { useEffect, useState } from "react";

// components
import Task from "./Task";
import GoalHeader from "./GoalHeader";
import Button from "./Button";

//etc
import { TaskSchema } from "../schema/TaskSchema";
import readGoal from "../api/readGoal";
import { GoalProps } from "../schema/GoalSchema";
import isLoaded from "../isLoaded";
import { UserSchema } from "../schema/UserSchema";
import updateGoal from "../api/updateGoal";

interface Props {
  user: UserSchema;
  goalId: string;
  setCurrGoalTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Goal = (props: Props) => {
  const [goalProps, setGoalProps] = useState<GoalProps | undefined>();
  const [taskArray, setTaskArray] = useState<TaskSchema[]>([]);
  const [creatingTask, setCreatingTask] = useState(false);

  /**
   * Readies goal to respond accoridngly to new task interaction.
   * @note For more info, check Task.tsx
   */
  function createTaskBtn() {
    const newTask = {
      title: "",
      userId: props.user._id,
      goalId: props.goalId,
      statusIndex: 0,
    } as TaskSchema;

    setTaskArray((prev) => [...prev, newTask]);
    setCreatingTask(true);
  }

  useEffect(() => {
    async function initGoal() {
      const readGoalRes = await readGoal(props.user._id, props.goalId);
      if (!(readGoalRes instanceof Error)) {
        const { taskArray, ...rest } = readGoalRes;
        setGoalProps(rest as GoalProps);
        setTaskArray((prev) => readGoalRes.taskArray);
        props.setCurrGoalTitle(readGoalRes.title);
      }
    }

    if (goalProps) {
      updateGoal(props.user._id, props.goalId, goalProps);
    } else {
      initGoal();
    }
  }, [props, goalProps]);

  return (
    <>
      <GoalHeader
        goalId={goalProps?._id}
        description={goalProps?.description}
        title={goalProps?.title}
        setGoalProps={setGoalProps}
        userId={props.user._id}
      />

      <hr className="border-dark-300" />

      <div className="flex flex-col gap-y-2 items-start">
        {taskArray.length !== 0 && isLoaded<GoalProps>(goalProps) ? (
          taskArray.map((task, index) => (
            <Task
              statusColorArray={goalProps.statusColorArray}
              key={index}
              task={task}
              taskIndex={index}
              setTaskArray={setTaskArray}
              setCreatingTask={setCreatingTask}
              isNewTask={
                creatingTask && index === taskArray.length - 1 ? true : false
              }
            />
          ))
        ) : (
          <p>There is no task in the goal! Start by adding one!</p>
        )}

        <Button onClick={() => createTaskBtn()}>CREATE TASK</Button>
      </div>
    </>
  );
};

export default Goal;
