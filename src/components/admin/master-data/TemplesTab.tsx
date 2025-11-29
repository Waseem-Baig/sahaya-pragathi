import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Church, Plus, Edit, Trash2, Upload, Download } from "lucide-react";

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

export function TemplesTab() {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Temple>>({});
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

  const handleEdit = (temple: Temple) => {
    setIsEditing(`temples-${temple.id}`);
    setEditData(temple);
  };

  const handleSave = () => {
    setTemples(prev => prev.map(t => t.id === editData.id ? { ...t, ...editData } : t));
    setIsEditing(null);
    setEditData({});
  };

  const handleDelete = (id: string) => {
    setTemples(prev => prev.filter(t => t.id !== id));
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
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
  };

  return (
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
            <Button onClick={handleAdd} variant="government">
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
                    <Select 
                      value={editData.district} 
                      onValueChange={(value) => setEditData(prev => ({ ...prev, district: value }))}
                    >
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
                        <Button size="sm" onClick={handleSave}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(temple)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(temple.id)}>
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
