import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import './CategoryFilter.css';

const CategoryItem = ({ category, activeSlug, isInitiallyExpanded = false }) => {
    // State để quản lý việc mục này có được mở rộng hay không.
    // Giá trị ban đầu được xác định bởi prop isInitiallyExpanded.
    const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
    const [children, setChildren] = useState([]);
    const [isLoadingChildren, setIsLoadingChildren] = useState(false);

    const isDropdown = category.type === 'DROPDOWN';
    const isActive = category.slug === activeSlug;

    // Effect này chạy khi component được mount hoặc khi isInitiallyExpanded thay đổi.
    // Nó chịu trách nhiệm tải trước danh sách con cho danh mục được yêu cầu mở rộng ban đầu.
    useEffect(() => {
        const loadInitialChildren = async () => {
            // Chỉ tải khi mục được yêu cầu mở rộng, là loại DROPDOWN, và chưa có danh sách con.
            if (isInitiallyExpanded && isDropdown && children.length === 0) {
                setIsLoadingChildren(true);
                try {
                    const childData = await categoryService.getChildrenByParentId(category.id);
                    setChildren(childData);
                } catch (error) {
                    console.error("Lỗi khi tải danh mục con ban đầu:", error);
                } finally {
                    setIsLoadingChildren(false);
                }
            }
        };
        loadInitialChildren();
    }, [isInitiallyExpanded, isDropdown, category.id, children.length]);

    // Cập nhật trạng thái isExpanded nếu prop isInitiallyExpanded thay đổi từ bên ngoài
    useEffect(() => {
        setIsExpanded(isInitiallyExpanded);
    }, [isInitiallyExpanded]);


    // Xử lý khi người dùng *nhấn thủ công* vào nút +/-.
    const handleToggleExpand = async (e) => {
        e.preventDefault();
        // Nếu mở rộng lần đầu, hãy tìm nạp danh sách con.
        if (!isExpanded && children.length === 0) {
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
        // Sau đó, đảo ngược trạng thái mở rộng.
        setIsExpanded(prev => !prev);
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
            {/* Danh sách danh mục con chỉ được hiển thị nếu isExpanded là true */}
            {isExpanded && (
                <ul className="subcategory-list">
                    {isLoadingChildren ? (
                        <li>Đang tải...</li>
                    ) : (
                        children.map(child => (
                           <li key={child.id} className={`subcategory-item ${child.slug === activeSlug ? 'active' : ''}`}>
                                <Link to={`/products?category=${child.slug}`}>
                                    <span className="radio-icon"></span>
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

    const [categoriesToDisplay, setCategoriesToDisplay] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(true);
    // State này sẽ giữ ID của danh mục cần được mở rộng mặc định.
    const [expandedCategoryId, setExpandedCategoryId] = useState(null);

    useEffect(() => {
        const fetchCategoriesForPage = async () => {
            setIsLoading(true);
            setExpandedCategoryId(null); // Reset trạng thái mở rộng mỗi khi điều hướng

            try {
                if (activeSlug === 'all') {
                    // Trên trang /products chính, chỉ hiển thị các danh mục cấp cao nhất.
                    const rootCategories = await categoryService.getRootCategories();
                    setCategoriesToDisplay(rootCategories);
                } else {
                    // Chúng ta đang ở một trang danh mục cụ thể.
                    const currentCategory = await categoryService.getCategoryBySlug(activeSlug);

                    if (currentCategory) {
                        let displayList = [];
                        // Xác định danh sách các danh mục cần hiển thị trong sidebar.
                        if (currentCategory.parentId) {
                            // Nếu danh mục hiện tại có cha (ví dụ: 'ao-nam'),
                            // danh sách hiển thị là các mục anh em của nó (tất cả con của cùng một cha).
                            displayList = await categoryService.getChildrenByParentId(currentCategory.parentId);
                        } else {
                            // Nếu danh mục hiện tại KHÔNG có cha (là mục cấp cao nhất như 'ao'),
                            // danh sách hiển thị là các con của chính nó.
                            displayList = await categoryService.getChildrenByParentId(currentCategory.id);
                        }
                        setCategoriesToDisplay(displayList);

                        // Nếu danh mục đang hoạt động là loại dropdown, chúng ta nên mở rộng nó.
                        if (currentCategory.type === 'DROPDOWN') {
                            setExpandedCategoryId(currentCategory.id);
                        }
                    } else {
                        // Dự phòng nếu slug không hợp lệ.
                        const rootCategories = await categoryService.getRootCategories();
                        setCategoriesToDisplay(rootCategories);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục chính:", error);
                setCategoriesToDisplay([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoriesForPage();
    }, [activeSlug]); // Effect này chạy lại mỗi khi `category` trong URL thay đổi.

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
                            {categoriesToDisplay.map(cat => (
                                <CategoryItem
                                    key={cat.id}
                                    category={cat}
                                    activeSlug={activeSlug}
                                    // Báo cho component CategoryItem phải được mở rộng nếu ID của nó khớp.
                                    isInitiallyExpanded={cat.id === expandedCategoryId}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;