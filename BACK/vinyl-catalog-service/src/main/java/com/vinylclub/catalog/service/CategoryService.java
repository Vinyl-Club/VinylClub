
package com.vinylclub.catalog.service;

import com.vinylclub.catalog.dto.CategoryDTO;
import com.vinylclub.catalog.dto.ProductDTO;
import com.vinylclub.catalog.entity.Category;
import com.vinylclub.catalog.repository.CategoryRepository;
import com.vinylclub.catalog.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    /**
     *Recover all categories
     */
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     *Recover a category by ID
     */
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return convertToDTO(category);
    }

    /**
     *Recover products from a category
     */
    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        // Check that the category exists
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
        
        // Recover products
        return productRepository.findByCategoryId(categoryId, pageable)
                .map(product -> productService.convertToDTO(product));
    }

    /**
     *Create a new category
     */
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        // Check that the name does not already exist
        if (categoryRepository.findByNameIgnoreCase(categoryDTO.getName()).isPresent()) {
            throw new RuntimeException("Category with name '" + categoryDTO.getName() + "' already exists");
        }

        Category category = convertToEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    /**
     *Update a category
     */
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check that the new name does not already exist (unless it is the same category)
        categoryRepository.findByNameIgnoreCase(categoryDTO.getName())
                .ifPresent(category -> {
                    if (!category.getId().equals(id)) {
                        throw new RuntimeException("Category with name '" + categoryDTO.getName() + "' already exists");
                    }
                });

        existingCategory.setName(categoryDTO.getName());

        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToDTO(updatedCategory);
    }

    /**
     *Delete a category
     */
    public void deleteCategory(Long id) {
        // Check that the category has no associated products
        Page<ProductDTO> products = getProductsByCategory(id, Pageable.ofSize(1));
        if (products.getTotalElements() > 0) {
            throw new RuntimeException("Cannot delete category: " + products.getTotalElements() + " products are associated with this category");
        }

        categoryRepository.deleteById(id);
    }

    /**
     * Conversion Entity → DTO
     */
    private CategoryDTO convertToDTO(Category category) {
        return new CategoryDTO(
                category.getId(),
                category.getName()
        );
    }

    /**
     * Conversion DTO → Entity
     */
    private Category convertToEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        return category;
    }
}
