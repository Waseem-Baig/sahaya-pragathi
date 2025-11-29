import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Category {
  name: string;
  count: number;
  percentage: number;
  trend: string;
}

interface TopCategoriesProps {
  categories: Category[];
}

export function TopCategories({ categories }: TopCategoriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Issue Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{category.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{category.count}</Badge>
                <span className="text-xs text-muted-foreground">{category.trend}</span>
              </div>
            </div>
            <Progress value={category.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
