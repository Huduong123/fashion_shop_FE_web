import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import './CategoryFilter.css'; // Sẽ tạo file CSS ở bước sau

const CategoryItem = ({ category, activeSlug }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [children, setChildren] = useState([]);
    const [isLoadingChildren, setIsLoadingChildren] = useState(false);

    const isDropdown = category.type === 'DROPDOWN';
    const isActive = category.slug === activeSlug;

    const handleToggleExpand = async (e) => {
        e.preventDefault(); // Ngăn Link điều hướng khi chỉ nhấn vào dấu +/-
        if (!isExpanded) {
            setIsLoadingChildren(true);
            try {
                const childData = await categoryService.getChildrenByParentId(category.id);
                setChildren(childData);
            } catch (error) {
                console.error("Lỗi khi tải danh mục con:", error);
            } finally {
                setIsLoadingChildren(false);
            }
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <li className={`category-item ${isActive ? 'active' : ''}`}>
            <div className="category-item-row">
                <Link to={`/products?category=${category.slug}`} className="category-link">
                    <span className="radio-icon"></span>
                    <span className="category-name">{category.name}</span>
                </Link>
                {isDropdown && (
                    <button onClick={handleToggleExpand} className="expand-toggle">
                        {isExpanded ? '−' : '+'}
                    </button>
                )}
            </div>
            {isExpanded && (
                <ul className="subcategory-list">
                    {isLoadingChildren ? (
                        <li>Đang tải...</li>
                    ) : (
                        children.map(child => (
                           <li key={child.id} className={`subcategory-item ${child.slug === activeSlug ? 'active' : ''}`}>
                                {/* Sửa Link bên dưới */}
                                <Link to={`/products?category=${child.slug}`}>
                                    <span className="radio-icon"></span>
                                    {/* Bọc child.name trong span để áp dụng CSS đồng nhất */}
                                    <span className="category-name">{child.name}</span>
                                </Link>
                           </li>
                        ))
                    )}
                </ul>
            )}
        </li>
    );
};


const CategoryFilter = () => {
    const [searchParams] = useSearchParams();
    const activeSlug = searchParams.get('category') || 'all';

    const [rootCategories, setRootCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(true);

    useEffect(() => {
        const fetchRootCategoriesForPage = async () => {
            setIsLoading(true);
            try {
                if (activeSlug === 'all') {
                    // Trang chính, hiển thị các danh mục gốc
                    const roots = await categoryService.getRootCategories();
                    setRootCategories(roots);
                } else {
                    // Tìm danh mục cha của slug hiện tại để hiển thị các "anh em"
                    const currentCategory = await categoryService.getCategoryBySlug(activeSlug);
                    if (currentCategory && currentCategory.parentId) {
                        const siblings = await categoryService.getChildrenByParentId(currentCategory.parentId);
                        setRootCategories(siblings);
                    } else if (currentCategory) {
                        // Nếu là danh mục gốc, hiển thị các con của nó
                        const children = await categoryService.getChildrenByParentId(currentCategory.id);
                        setRootCategories(children);
                    } else {
                        // Nếu slug không hợp lệ, hiển thị các danh mục gốc
                        const roots = await categoryService.getRootCategories();
                        setRootCategories(roots);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục chính:", error);
                setRootCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRootCategoriesForPage();
    }, [activeSlug]);

    return (
        <div className="filter-group">
            <div className="filter-title" onClick={() => setIsFilterVisible(!isFilterVisible)}>
                <h3>Danh mục</h3>
                <span className={`toggle-arrow ${isFilterVisible ? 'expanded' : ''}`}>▼</span>
            </div>
            {isFilterVisible && (
                <div className="category-filter-list">
                    {isLoading ? (
                        <p>Đang tải...</p>
                    ) : (
                        <ul>
                            {rootCategories.map(cat => (
                                <CategoryItem key={cat.id} category={cat} activeSlug={activeSlug} />
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;