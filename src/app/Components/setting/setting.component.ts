import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../shared/Services/task.service';
import { Task } from '../../shared/models/task.model';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { title: '', description: '', status: 1};
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
  //  this.taskService.getTasks().subscribe(data => this.tasks = data);
  }
  
  createTask() {
    this.taskService.createTask(this.newTask).subscribe(() => {
      this.loadTasks();
      this.newTask = { title: '', description: '', status: 1 };
    });
  }

  editTask(task: Task) {
    this.editingTask = { ...task };
  }

  updateTask() {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask).subscribe(() => {
        this.loadTasks();
        this.editingTask = null;
      });
    }
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }
}
