import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, Edit, Trash2 } from "lucide-react";

interface Institution {
  id: string;
  name: string;
  type: 'SCHOOL' | 'COLLEGE' | 'UNIVERSITY' | 'HOSPITAL';
  district: string;
  contactPerson: string;
  phone: string;
  email?: string;
}

export function InstitutionsTab() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Institution>>({});
  const [institutions, setInstitutions] = useState<Institution[]>([
    {
      id: '1',
      name: 'Government General Hospital',
      type: 'HOSPITAL',
      district: 'SPSR Nellore',
      contactPerson: 'Dr. Kumar',
      phone: '9876543212',
      email: 'ggh.nellore@gov.ap.in'
    },
    {
      id: '2',
      name: 'Andhra University',
      type: 'UNIVERSITY',
      district: 'Visakhapatnam',
      contactPerson: 'Registrar',
      phone: '9876543213',
      email: 'registrar@andhrauniversity.edu.in'
    }
  ]);

  const handleEdit = (institution: Institution) => {
    setIsEditing(`institutions-${institution.id}`);
    setEditData(institution);
  };

  const handleSave = () => {
    setInstitutions(prev => prev.map(i => i.id === editData.id ? { ...i, ...editData } : i));
    setIsEditing(null);
    setEditData({});
  };

  const handleDelete = (id: string) => {
    setInstitutions(prev => prev.filter(i => i.id !== id));
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    const newInstitution: Institution = {
      id: newId,
      name: '',
      type: 'HOSPITAL',
      district: '',
      contactPerson: '',
      phone: ''
    };
    setInstitutions(prev => [...prev, newInstitution]);
    setIsEditing(`institutions-${newId}`);
    setEditData(newInstitution);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Institution Management
            </CardTitle>
            <CardDescription>
              Manage hospitals, schools, colleges, and other institutions
            </CardDescription>
          </div>
          <Button onClick={handleAdd} variant="government">
            <Plus className="h-4 w-4 mr-2" />
            Add Institution
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutions.map((institution) => (
              <TableRow key={institution.id}>
                <TableCell>
                  {isEditing === `institutions-${institution.id}` ? (
                    <Input
                      value={editData.name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    institution.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing === `institutions-${institution.id}` ? (
                    <Select 
                      value={editData.type} 
                      onValueChange={(value: string) => setEditData(prev => ({ ...prev, type: value as Institution['type'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOSPITAL">Hospital</SelectItem>
                        <SelectItem value="SCHOOL">School</SelectItem>
                        <SelectItem value="COLLEGE">College</SelectItem>
                        <SelectItem value="UNIVERSITY">University</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="info">{institution.type}</Badge>
                  )}
                </TableCell>
                <TableCell>{institution.district}</TableCell>
                <TableCell>{institution.contactPerson}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{institution.phone}</p>
                    {institution.email && <p className="text-muted-foreground">{institution.email}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {isEditing === `institutions-${institution.id}` ? (
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
                        <Button size="sm" variant="outline" onClick={() => handleEdit(institution)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(institution.id)}>
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
