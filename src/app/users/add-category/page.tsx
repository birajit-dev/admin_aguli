'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Category {
  _id: string;
  cat_name: string;
  cat_code: string;
  cat_slug: string;
  cat_status: string;
  cat_order: number;
  update_date: string;
  cat_thumb?: string;
}

const AddCategoryPage: React.FC = () => {
  const [catName, setCatName] = useState('');
  const [catStatus, setCatStatus] = useState('active');
  const [catOrder, setCatOrder] = useState<number>(0);
  const [catThumbnail, setCatThumbnail] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For editing
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('active');
  const [editOrder, setEditOrder] = useState<number>(0);
  const [editThumbnail, setEditThumbnail] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/category/list?key=${localStorage.getItem('saasAPI')}`
      );
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.categories || data.data?.categories || []);
    } catch (err: any) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!catName.trim()) {
      setError('Category name is required');
      return;
    }
    if (!catThumbnail.trim()) {
      setError('Thumbnail link is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/category/add?key=${localStorage.getItem('saasAPI')}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cat_name: catName,
            cat_status: catStatus,
            cat_order: catOrder,
            cat_thumb: catThumbnail,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add category');
      }
      setSuccess('Category added successfully!');
      setCatName('');
      setCatOrder(0);
      setCatStatus('active');
      setCatThumbnail('');
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (cat_id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/category/delete/${cat_id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete category');
      setSuccess('Category deleted successfully!');
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat._id);
    setEditName(cat.cat_name);
    setEditStatus(cat.cat_status);
    setEditOrder(cat.cat_order);
    setEditThumbnail(cat.cat_thumb || '');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditStatus('active');
    setEditOrder(0);
    setEditThumbnail('');
  };

  const handleEditCategory = async (cat_id: string) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/aguli_tv/category/edit/${cat_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cat_name: editName,
            cat_status: editStatus,
            cat_order: editOrder,
            cat_thumbnail: editThumbnail,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update category');
      setSuccess('Category updated successfully!');
      setEditId(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <Card className="shadow-md border border-border bg-background">
        <CardHeader className="rounded-t-lg p-4 border-b border-border">

            
          <CardTitle>
            Add Category
          </CardTitle>
          <CardDescription>
            Add a new category for Aguli TV. Make your content organized and visually appealing!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-card p-4 rounded-lg shadow-sm">
            <div>
              <Label htmlFor="cat_name">Category Name</Label>
              <Input
                id="cat_name"
                value={catName}
                onChange={e => setCatName(e.target.value)}
                required
                placeholder="Enter category name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cat_status">Status</Label>
              <Select
                value={catStatus}
                onValueChange={setCatStatus}
              >
                <SelectTrigger id="cat_status" className="w-full mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cat_order">Order</Label>
              <Input
                id="cat_order"
                type="number"
                value={catOrder}
                onChange={e => setCatOrder(Number(e.target.value))}
                min={0}
                placeholder="Order (optional)"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cat_thumbnail">Thumbnail Link</Label>
              <Input
                id="cat_thumbnail"
                value={catThumbnail}
                onChange={e => setCatThumbnail(e.target.value)}
                required
                placeholder="Paste image URL (thumbnail)"
                className="mt-1"
              />
              {catThumbnail && (
                <div className="mt-2">
                  <img
                    src={catThumbnail}
                    alt="Category Thumbnail Preview"
                    className="rounded shadow border w-20 h-20 object-cover"
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="w-full">
                {loading ? 'Adding...' : 'Add Category'}
              </Button>
            </div>
          </form>

          <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Existing Categories
          </h2>
          <div className="flex flex-col gap-4">
            {categories.length === 0 && (
              <div className="text-center text-muted-foreground py-6 border rounded-md bg-card shadow-sm">
                No categories found.
              </div>
            )}
            {categories.map(cat =>
              editId === cat._id ? (
                <div
                  key={cat._id}
                  className="flex flex-col md:flex-row md:items-center gap-3 border border-border rounded-lg p-4 bg-muted shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Name</Label>
                    <Input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Slug</Label>
                    <div className="break-all text-muted-foreground text-sm">{cat.cat_slug}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Code</Label>
                    <div className="break-all text-muted-foreground text-sm">{cat.cat_code}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Status</Label>
                    <Select
                      value={editStatus}
                      onValueChange={setEditStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Order</Label>
                    <Input
                      type="number"
                      value={editOrder}
                      onChange={e => setEditOrder(Number(e.target.value))}
                      min={0}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Thumbnail</Label>
                    <Input
                      value={editThumbnail}
                      onChange={e => setEditThumbnail(e.target.value)}
                      placeholder="Paste image URL"
                      className="w-full"
                    />
                    {editThumbnail && (
                      <div className="mt-2">
                        <img
                          src={editThumbnail}
                          alt="Thumbnail Preview"
                          className="rounded shadow border w-12 h-12 object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Updated</Label>
                    <div className="break-all text-muted-foreground text-sm">{cat.update_date}</div>
                  </div>
                  <div className="flex flex-row gap-2 mt-2 md:mt-0">
                    <Button
                      size="sm"
                      onClick={() => handleEditCategory(cat._id)}
                      disabled={loading}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={cancelEdit}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={cat._id}
                  className="flex flex-col md:flex-row md:items-center gap-3 border border-border rounded-lg p-4 bg-card shadow-sm hover:shadow transition"
                >
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Name</Label>
                    <div className="break-all font-medium text-base text-foreground">{cat.cat_name}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Slug</Label>
                    <div className="break-all text-muted-foreground text-sm">{cat.cat_slug}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Code</Label>
                    <div className="break-all text-muted-foreground text-sm">{cat.cat_code}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Status</Label>
                    <span
                      className={
                        cat.cat_status === 'active'
                          ? 'text-green-600 text-sm'
                          : 'text-muted-foreground text-sm'
                      }
                    >
                      {cat.cat_status}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Order</Label>
                    <div className="text-sm">{cat.cat_order}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Thumbnail</Label>
                    {cat.cat_thumb ? (
                      <img
                        src={cat.cat_thumb}
                        alt="Category Thumbnail"
                        className="rounded shadow border w-12 h-12 object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm italic">No image</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="md:hidden">Updated</Label>
                    <div className="break-all text-muted-foreground text-sm">{cat.update_date}</div>
                  </div>
                  <div className="flex flex-row gap-2 mt-2 md:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(cat)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(cat._id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategoryPage;
