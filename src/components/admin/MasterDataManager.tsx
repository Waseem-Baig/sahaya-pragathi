import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  Church, 
  Building2, 
  MapPin, 
  Users,
  Settings,
  Upload,
  Download
} from "lucide-react";

interface Temple {
  id: string;
  name: string;
  code: string;
  district: string;
  vipQuota: number;
  generalQuota: number;
  contactPerson: string;
  phone: string;
}

interface Institution {
  id: string;
  name: string;
  type: 'SCHOOL' | 'COLLEGE' | 'UNIVERSITY' | 'HOSPITAL';
  district: string;
  contactPerson: string;
  phone: string;
  email?: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  headOfDepartment: string;
  psrCode?: string;
}

interface MasterDataManagerProps {
  userRole: 'L1';
}

export function MasterDataManager({ userRole }: MasterDataManagerProps) {
  const [activeTab, setActiveTab] = useState('temples');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Sample data
  const [temples, setTemples] = useState<Temple[]>([
    {
      id: '1',
      name: 'Sri Venkateswara Swamy Temple',
      code: 'TIR',
      district: 'Tirupati',
      vipQuota: 10,
      generalQuota: 50,
      contactPerson: 'Temple Officer',
      phone: '9876543210'
    },
    {
      id: '2',
      name: 'Sri Durga Malleswara Swamy Temple',
      code: 'VJW',
      district: 'Vijayawada',
      vipQuota: 5,
      generalQuota: 25,
      contactPerson: 'Shrine Manager',
      phone: '9876543211'
    }
  ]);

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

  const handleEdit = (type: string, item: any) => {
    setIsEditing(`${type}-${item.id}`);
    setEditData(item);
  };

  const handleSave = (type: string) => {
    if (type === 'temples') {
      setTemples(prev => prev.map(t => t.id === editData.id ? editData : t));
    } else if (type === 'institutions') {
      setInstitutions(prev => prev.map(i => i.id === editData.id ? editData : i));
    } else if (type === 'departments') {
      setDepartments(prev => prev.map(d => d.id === editData.id ? editData : d));
    }
    setIsEditing(null);
    setEditData({});
  };

  const handleDelete = (type: string, id: string) => {
    if (type === 'temples') {
      setTemples(prev => prev.filter(t => t.id !== id));
    } else if (type === 'institutions') {
      setInstitutions(prev => prev.filter(i => i.id !== id));
    } else if (type === 'departments') {
      setDepartments(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleAdd = (type: string) => {
    const newId = Date.now().toString();
    if (type === 'temples') {
      const newTemple: Temple = {
        id: newId,
        name: '',
        code: '',
        district: '',
        vipQuota: 0,
        generalQuota: 0,
        contactPerson: '',
        phone: ''
      };
      setTemples(prev => [...prev, newTemple]);
      setIsEditing(`temples-${newId}`);
      setEditData(newTemple);
    } else if (type === 'institutions') {
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
    } else if (type === 'departments') {
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Master Data Management</h2>
          <p className="text-muted-foreground">Manage temples, institutions, departments, and system configurations</p>
        </div>
        <Badge variant="primary">L1 Admin Access</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="temples" className="flex items-center gap-2">
            <Church className="h-4 w-4" />
            Temples
          </TabsTrigger>
          <TabsTrigger value="institutions" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Institutions
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </TabsTrigger>
        </TabsList>

        {/* Temples Tab */}
        <TabsContent value="temples">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Church className="h-5 w-5" />
                    Temple Management
                  </CardTitle>
                  <CardDescription>
                    Manage temple information, quotas, and contact details
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={() => handleAdd('temples')} variant="government">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Temple
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Temple Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>VIP Quota</TableHead>
                    <TableHead>General Quota</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {temples.map((temple) => (
                    <TableRow key={temple.id}>
                      <TableCell>
                        {isEditing === `temples-${temple.id}` ? (
                          <Input
                            value={editData.name || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full"
                          />
                        ) : (
                          temple.name
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing === `temples-${temple.id}` ? (
                          <Input
                            value={editData.code || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, code: e.target.value }))}
                            className="w-20"
                          />
                        ) : (
                          <Badge variant="outline">{temple.code}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing === `temples-${temple.id}` ? (
                          <Select value={editData.district} onValueChange={(value) => setEditData(prev => ({ ...prev, district: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SPSR Nellore">SPSR Nellore</SelectItem>
                              <SelectItem value="Guntur">Guntur</SelectItem>
                              <SelectItem value="Vijayawada">Vijayawada</SelectItem>
                              <SelectItem value="Visakhapatnam">Visakhapatnam</SelectItem>
                              <SelectItem value="Tirupati">Tirupati</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          temple.district
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing === `temples-${temple.id}` ? (
                          <Input
                            type="number"
                            value={editData.vipQuota || 0}
                            onChange={(e) => setEditData(prev => ({ ...prev, vipQuota: parseInt(e.target.value) }))}
                            className="w-20"
                          />
                        ) : (
                          temple.vipQuota
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing === `temples-${temple.id}` ? (
                          <Input
                            type="number"
                            value={editData.generalQuota || 0}
                            onChange={(e) => setEditData(prev => ({ ...prev, generalQuota: parseInt(e.target.value) }))}
                            className="w-20"
                          />
                        ) : (
                          temple.generalQuota
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{temple.contactPerson}</p>
                          <p className="text-muted-foreground">{temple.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {isEditing === `temples-${temple.id}` ? (
                            <>
                              <Button size="sm" onClick={() => handleSave('temples')}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit('temples', temple)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDelete('temples', temple.id)}>
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
        </TabsContent>

        {/* Institutions Tab */}
        <TabsContent value="institutions">
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
                <Button onClick={() => handleAdd('institutions')} variant="government">
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
                          <Select value={editData.type} onValueChange={(value) => setEditData(prev => ({ ...prev, type: value }))}>
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
                              <Button size="sm" onClick={() => handleSave('institutions')}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit('institutions', institution)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDelete('institutions', institution.id)}>
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
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
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
                <Button onClick={() => handleAdd('departments')} variant="government">
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
                              <Button size="sm" onClick={() => handleSave('departments')}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit('departments', department)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDelete('departments', department.id)}>
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
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Hierarchy
              </CardTitle>
              <CardDescription>
                Manage district, mandal, and ward/village hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Location hierarchy management</p>
                <p className="text-xs">District → Mandal → Ward/Village structure</p>
                <Button variant="outline" className="mt-4">
                  Configure Locations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}