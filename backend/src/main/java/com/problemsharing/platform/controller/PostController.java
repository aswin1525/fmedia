package com.problemsharing.platform.controller;

import com.problemsharing.platform.model.Comment;
import com.problemsharing.platform.model.Interaction;
import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ProblemPost createPost(@RequestBody ProblemPost post) {
        return postService.createPost(post);
    }

    @GetMapping
    public List<ProblemPost> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ProblemPost getPost(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @PostMapping("/{id}/interact")
    public void interact(@PathVariable Long id, @RequestParam String alias,
            @RequestParam Interaction.InteractionType type) {
        postService.interact(id, alias, type);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id, @RequestParam String alias) {
        postService.deletePost(id, alias);
    }

    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable Long id, @RequestParam String alias, @RequestBody Comment comment) {
        return postService.addComment(id, alias, comment.getContent(), comment.getParentId());
    }

    @GetMapping("/{id}/comments")
    public List<Comment> getComments(@PathVariable Long id) {
        return postService.getComments(id);
    }
}
