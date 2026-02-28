package com.problemsharing.platform.service;

import com.problemsharing.platform.model.Comment;
import com.problemsharing.platform.model.Interaction;
import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.repository.CommentRepository;
import com.problemsharing.platform.repository.InteractionRepository;
import com.problemsharing.platform.repository.ProblemPostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostService {
    private final ProblemPostRepository postRepository;
    private final CommentRepository commentRepository;
    private final InteractionRepository interactionRepository;

    public PostService(ProblemPostRepository postRepository, CommentRepository commentRepository,
            InteractionRepository interactionRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.interactionRepository = interactionRepository;
    }

    public ProblemPost createPost(ProblemPost post) {
        return postRepository.save(post);
    }

    public List<ProblemPost> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public ProblemPost getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Transactional
    public void interact(Long postId, String userAlias, Interaction.InteractionType type) {
        ProblemPost post = getPostById(postId);

        // Check if user already interacted
        if (interactionRepository.findByPostIdAndUserAliasAndType(postId, userAlias, type).isPresent()) {
            return; // Already interacted
        }

        Interaction interaction = new Interaction();
        interaction.setPost(post);
        interaction.setUserAlias(userAlias);
        interaction.setType(type);
        interactionRepository.save(interaction);

        if (type == Interaction.InteractionType.UPVOTE) {
            post.setUpvotes(post.getUpvotes() + 1);
        } else {
            post.setReposts(post.getReposts() + 1);
        }
        postRepository.save(post);
    }

    public Comment addComment(Long postId, String userAlias, String content) {
        ProblemPost post = getPostById(postId);
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUserAlias(userAlias);
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public List<Comment> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }
}
