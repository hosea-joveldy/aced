export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  enrollmentCode?: string;
}

export interface ClassroomAssignmentImport {
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string | null; // 'YYYY-MM-DD'
  notes?: string | null;
}

export interface ClassroomProvider {
  isAvailable(): boolean;
  listCourses(): Promise<ClassroomCourse[]>;
  importAssignments(courseId: string): Promise<ClassroomAssignmentImport[]>;
}

export class NoopClassroomProvider implements ClassroomProvider {
  isAvailable(): boolean {
    return false;
  }

  async listCourses(): Promise<ClassroomCourse[]> {
    return [];
  }

  async importAssignments(): Promise<ClassroomAssignmentImport[]> {
    return [];
  }
}

export function createClassroomProvider(): ClassroomProvider {
  return new NoopClassroomProvider();
}
