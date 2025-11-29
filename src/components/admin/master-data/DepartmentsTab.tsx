import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Edit, Trash2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  headOfDepartment: string;
  psrCode?: string;
}

export function DepartmentsTab() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Department>>({});
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Water Supply Department',
      code: 'WSD',
      email: 'watersupply@gov.ap.in',
      phone: '9876543214',
      headOfDepartment: 'Chief Engineer',
      psrCode: 'PSR001'
    },
    {
      id: '2',
      name: 'Roads & Buildings',
      code: 'RB',
      email: 'rb@gov.ap.in',
      phone: '9876543215',
      headOfDepartment: 'Executive Engineer',
      psrCode: 'PSR002'
    }
  ]);

  const handleEdit = (department: Department) => {
    setIsEditing(`departments-${department.id}`);
    setEditData(department);
  };

  const handleSave = () => {
    setDepartments(prev => prev.map(d => d.id === editData.id ? { ...d, ...editData } : d));
    setIsEditing(null);
    setEditData({});
  };

  const handleDelete = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newDepartment: Department = {
      id: newId,
      name: '',
      code: '',
      email: '',
      phone: '',
      headOfDepartment: ''
    };
    setDepartments(prev => [...prev, newDepartment]);
    setIsEditing(`departments-${newId}`);
    setEditData(newDepartment);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Department Management
            </CardTitle>
            <CardDescription>
              Manage government departments and their contact information
            </CardDescription>
          </div>
          <Button onClick={handleAdd} variant="government">
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Head of Department</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>PSR Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>
                  {isEditing === `departments-${department.id}` ? (
                    <Input
                      value={editData.name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    department.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing === `departments-${department.id}` ? (
                    <Input
                      value={editData.code || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, code: e.target.value }))}
                      className="w-20"
                    />
                  ) : (
                    <Badge variant="outline">{department.code}</Badge>
                  )}
                </TableCell>
                <TableCell>{department.headOfDepartment}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{department.phone}</p>
                    <p className="text-muted-foreground">{department.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{department.psrCode}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {isEditing === `departments-${department.id}` ? (
                      <>
                        <Button size="sm" onClick={handleSave}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(department)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(department.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
