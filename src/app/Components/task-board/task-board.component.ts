import { Component } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { TaskService } from '../../shared/Services/task.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-task-board',
  imports: [SharedModule],
  standalone: true,
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent {
  tasks: Task[] = [];
  ToDoTasks: TaskInterface[] = [];
  InProgressTasks: TaskInterface[] = [];
  DoneTasks: TaskInterface[] = [];
  loginuser: any = null;
  filteredDoneTasks: any[] = [];
  receivedtasks: TaskInterface[] =new Array<TaskInterface>();

  //id: number = 0;

  TaskPriority: string[] = ['Low', 'Medium', 'High'];
  TaskPriorityIcon: string[] = ['🟢', '🟡', '🔴'];
  constructor(private taskService: TaskService) {
    //this.loadTasks();
  }
  
  ngOnInit(): void {
    //this.loginuser = localStorage.getItem('loggedIn');
    
    this.loadTasks();
    
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
     
  }
  filterDoneTasksByUser(){
    const loginpart = localStorage.getItem('loggedIn');
    if(loginpart)
    {
      this.loginuser = JSON.parse(loginpart);
      if(this.loginuser.role === "User") {
        this.filteredDoneTasks = this.receivedtasks.filter(
          task => task.username === this.loginuser.username 
        );
        console.log(this.filteredDoneTasks);  
      }
      else if(this.loginuser.role === "Admin") {
        this.filteredDoneTasks = this.receivedtasks; // Admin sees all done tasks
      }
    }
  }
  
    loadTasks() {
        this.taskService.getTasks().subscribe(
          data => {
            for (const task of data) {
              const newTask: TaskInterface = {
                id: task.id,
                title: task.title,
                description: task.description,
                dueDate: task.dueDate ? task.dueDate : undefined,
                status: task.status,
                priority: task.priority ? this.TaskPriority[task.priority-1] : "Low", // Cast to TaskPriority
                priorityIcon: task.priority ? this.TaskPriorityIcon[task.priority-1] : "🟢", // 
                username: task.username
              };
              this.receivedtasks.push(newTask);
            }
            console.log(this.receivedtasks);
            
            this.filterDoneTasksByUser();
            console.log(this.filteredDoneTasks);  
            for (const task of this.filteredDoneTasks) {
              if (task.status === 1) {
                  this.ToDoTasks.push(task);
              } else if (task.status === 2) {
                  this.InProgressTasks.push(task);
              } else if (task.status === 3) {
                  this.DoneTasks.push(task);
              }
            }
            console.log("this.ToDoTasks");
            console.log(this.ToDoTasks);
            console.log("this.InProgressTasks");
            console.log(this.InProgressTasks);
            console.log("this.DoneTasks");
            console.log(this.DoneTasks);
          }
        );   
        
    }
}
export interface TaskInterface {
  id?: number;
  title: string;
  description?: string;
  dueDate?: Date;
  status?: number; // 1: To Do, 2: In Progress, 3: Done
  priority?: string;
  priorityIcon?: string;
  username?: string;
}
